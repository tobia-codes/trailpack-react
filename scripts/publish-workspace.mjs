#!/usr/bin/env node
// Publishes every non-private workspace package whose exact version is not on
// the registry yet. Uses `npm publish` rather than `changeset publish`, because
// changesets detects the pnpm lockfile and would shell out to `pnpm publish`,
// which has no OIDC / trusted publishing support.
import { execFileSync } from 'node:child_process';

const dryRun = process.argv.includes('--dry-run');

const workspacePackages = JSON.parse(
  execFileSync('pnpm', ['list', '-r', '--depth', '-1', '--json'], { encoding: 'utf8' }),
).filter((pkg) => !pkg.private);

let publishedCount = 0;

for (const { name, version, path } of workspacePackages) {
  let alreadyPublished = false;

  try {
    const output = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    alreadyPublished = output.trim() !== '';
  } catch {
    alreadyPublished = false;
  }

  if (alreadyPublished) {
    console.log(`skip     ${name}@${version} (already on npm)`);
    continue;
  }

  console.log(`publish  ${name}@${version}`);

  if (!dryRun) {
    execFileSync('npm', ['publish'], { cwd: path, stdio: 'inherit' });
  }

  publishedCount += 1;
}

console.log(`\n${publishedCount} package(s)${dryRun ? ' would be' : ''} published`);
