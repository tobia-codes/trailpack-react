#!/usr/bin/env node
// Publishes every non-private workspace package whose exact version is not on
// the registry yet. Uses `npm publish` rather than `changeset publish`, because
// changesets detects the pnpm lockfile and would shell out to `pnpm publish`,
// which has no OIDC / trusted publishing support.
import { execFileSync } from 'node:child_process';

const dryRun = process.argv.includes('--dry-run');

// Every npm call runs in the package directory, never in the repo root: the
// root package.json declares devEngines.packageManager = pnpm, which makes npm
// refuse to run at all (EBADDEVENGINES).
const npm = (args, cwd) =>
  execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const stderrOf = (error) => String(error?.stderr ?? '');

/**
 * Whether this exact version is already on the registry.
 *
 * Only a confirmed 404 counts as "no". Any other failure — a network error, a
 * rate limit, an outage — would otherwise be read as absence and trigger a
 * publish of something that may well exist.
 */
function isPublished(name, version, cwd) {
  try {
    // npm answers E404 both for an unknown package and for a known package
    // without this version ("No match found for version"), so the catch below
    // covers both. The emptiness check is only a guard against a silent
    // success with no output.
    return npm(['view', `${name}@${version}`, 'version'], cwd).trim() !== '';
  } catch (error) {
    const stderr = stderrOf(error);

    if (/\bE404\b|404 Not Found/.test(stderr)) {
      return false;
    }

    throw new Error(
      `Could not determine whether ${name}@${version} is on the registry.\n${stderr.trim()}`,
    );
  }
}

/**
 * npm rejects publishing over an existing version. That is the desired end
 * state, not a failure — and it is reachable even when isPublished() said no,
 * because the registry's read replica lags behind writes by minutes. Treating
 * it as success is what makes this script safe to re-run.
 */
const isVersionConflict = (stderr) =>
  /\bEPUBLISHCONFLICT\b/.test(stderr) || /cannot publish over/i.test(stderr);

let publishedCount = 0;
let skippedCount = 0;

const workspacePackages = JSON.parse(
  execFileSync('pnpm', ['list', '-r', '--depth', '-1', '--json'], { encoding: 'utf8' }),
).filter((pkg) => !pkg.private);

for (const { name, version, path } of workspacePackages) {
  if (isPublished(name, version, path)) {
    console.log(`skip     ${name}@${version} (already on npm)`);
    skippedCount += 1;
    continue;
  }

  console.log(`publish  ${name}@${version}`);

  if (dryRun) {
    publishedCount += 1;
    continue;
  }

  try {
    process.stdout.write(npm(['publish'], path));
    publishedCount += 1;
  } catch (error) {
    const stderr = stderrOf(error);

    if (!isVersionConflict(stderr)) {
      process.stderr.write(stderr);
      throw error;
    }

    console.log(`skip     ${name}@${version} (already on npm, registry lag)`);
    skippedCount += 1;
  }
}

console.log(
  `\n${publishedCount} package(s)${dryRun ? ' would be' : ''} published, ${skippedCount} skipped`,
);
