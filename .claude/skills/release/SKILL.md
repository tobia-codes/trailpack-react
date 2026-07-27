---
name: release
description: How versioning and publishing work in this monorepo — creating changesets, choosing bump levels, the automated version PR, the OIDC publish, and diagnosing failed releases. Use when cutting a release, writing or reviewing a changeset, changing release.yml or scripts/publish-workspace.mjs, or when a publish job fails.
---

# Releasing

Versions in this repository are **never** edited by hand, and no agent should
ever bump a `version` field directly. The pipeline derives versions from
changesets.

## The three stages

Only stage 1 is done by a human or an agent. Stages 2 and 3 are automated by
`.github/workflows/release.yml`, which runs on every push to `main`.

### 1. Record the change — `pnpm changeset`

Run it after making a change that affects a published package. It writes a file
such as `.changeset/olive-pans-shout.md`:

```markdown
---
"@trailpack/react-codeconventions": minor
---

Add a `jsx-a11y` preset to the base oxlint config.
```

Commit that file together with the code change. The summary becomes the public
changelog entry — write it for someone consuming the package, not for the
reviewer of the diff.

The file can also be written directly instead of using the prompt, which is
usually easier for an agent. The format above is the whole contract: a YAML
block mapping package names to `patch` / `minor` / `major`, then a Markdown
body.

Check what is queued at any time with `pnpm changeset status`.

### 2. The version PR — automatic

When changesets are pending on `main`, `changesets/action` opens or updates a PR
titled `chore: version packages` that bumps the versions, writes the changelogs
and deletes the consumed changeset files.

Never edit versions inside that PR. To fix a bad changelog entry, correct the
original changeset on `main`; the PR regenerates itself. The PR accumulates, so
several merged features release together as one version.

### 3. Publish — automatic, on merging the version PR

With no changesets left, the workflow takes the publish path:
`scripts/publish-workspace.mjs` publishes every non-private workspace package
whose exact version is not yet on the registry, then `pnpm changeset tag`
creates the git tags and they are pushed.

Authentication is OIDC trusted publishing, configured per package on npmjs.com
against this repository and the `release.yml` workflow filename. There is no npm
token to rotate or leak.

## Choosing a bump level

| Bump | When |
| --- | --- |
| `patch` | Bug fixes, docs, internal changes — nothing consumers must react to |
| `minor` | New rules, exports or options; additive and backwards compatible |
| `major` | Anything that can break a consumer: removed or renamed exports, stricter defaults that newly fail a build |

For shared config packages, judge by the effect on a consuming build. Tightening
a lint rule from `warn` to `error` turns a green build red and is therefore a
**major** change, even though the diff is one word.

Changes that never reach the published artifact — CI config, the root README,
tests, `scripts/` — need no changeset.

## Rehearsing locally

The version step is fully reversible:

```sh
pnpm changeset                                # create one
pnpm changeset version                        # bump + changelog, locally
node scripts/publish-workspace.mjs --dry-run  # what would be published
git checkout . && git clean -fd .changeset    # undo all of it
```

`npm pack --dry-run`, run **from inside the package directory**, lists the exact
files that would ship.

## Command reference

`changeset` and `changeset tag` sit at opposite ends of the cycle and are easy
to confuse:

| Command | Stage | Effect |
| --- | --- | --- |
| `pnpm changeset` (alias for `add`) | development | writes `.changeset/*.md`; touches nothing else |
| `pnpm changeset status` | any | read-only report of pending bumps |
| `pnpm changeset version` | version PR, CI | consumes the `.md` files, bumps `package.json`, writes changelogs |
| `pnpm changeset tag` | after publish, CI | creates git tags for the versions currently in `package.json` |

`changeset tag` only creates tags locally; the workflow pushes them in a
separate `git push --tags`.

## Failure modes

These have all actually occurred here. Check them before theorising.

**`E422 — Failed to validate repository information`, after provenance was
signed.** The package is missing a `repository` field, or its `url` does not
resolve to this repository. Provenance is signed first and validated second, so
"Provenance statement published to transparency log" appearing in the log does
not mean the upload succeeded. The new-package skill has the required shape.

**`EBADDEVENGINES`.** An `npm` command ran with the repository root as its
working directory; see AGENTS.md. Move the call into a package directory or pass
an explicit `cwd` — do not "fix" it by deleting `devEngines`.

**`403` on publish, for a version that already exists.** The
already-published check in `scripts/publish-workspace.mjs` failed silently — its
`npm view` call is wrapped in a `try/catch` that treats any error as "not
published". Confirm the call still passes `cwd: path`.

**`403` when the action tries to open the version PR.** Repository → Settings →
Actions → General → *Allow GitHub Actions to create and approve pull requests*
is disabled. The `permissions` block in the workflow is not sufficient on its
own.

**A publish failed after the version PR was merged.** No new changeset is
needed. The version in `package.json` is already correct and the registry never
received it, so fixing the underlying problem and pushing to `main` is enough —
the workflow finds no pending changesets, takes the publish path, and ships the
same version number.

## Constraints

- The publish step uses `npm publish`, not `changeset publish`, on purpose.
  Changesets detects the pnpm lockfile and delegates to `pnpm publish`, which
  has no OIDC support. Do not "simplify" this back.
- Do not add an `NPM_TOKEN` secret. If publishing fails, the fix is in the
  trusted publisher configuration or the package metadata, not in a token.
