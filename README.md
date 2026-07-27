# trailpack-react

Monorepo for the Trailpack React toolchain. Managed with [pnpm](https://pnpm.io)
workspaces and [Turborepo](https://turbo.build), versioned and released with
[Changesets](https://github.com/changesets/changesets).

## Packages

| Package | Description |
| --- | --- |
| [`@trailpack/react-codeconventions`](packages/conventions) | Shared minimal oxlint + oxfmt config |

Workspaces are picked up from `packages/*` and `apps/*`. Any package with
`"private": true` is skipped by the release pipeline.

## Getting started

```sh
pnpm install
pnpm build     # turbo run build
pnpm lint      # turbo run lint
pnpm test      # turbo run test
```

## Versioning and releases

Versions are **never bumped by hand**. Every user-facing change ships with a
*changeset*: a small Markdown file describing what changed and how it should
affect the version number. The release pipeline collects those files, bumps the
versions, writes changelogs, and publishes to npm.

The flow has three stages, and only the first one is your job.

### 1. Add a changeset (with your change)

After making a change, run:

```sh
pnpm changeset
```

The prompt asks which packages changed, what bump each one needs, and for a
short summary. It writes a file like `.changeset/olive-pans-shout.md`:

```markdown
---
"@trailpack/react-codeconventions": minor
---

Add a `jsx-a11y` preset to the base oxlint config.
```

**Commit that file alongside your code change.** The summary becomes the
changelog entry, so write it for consumers of the package, not for reviewers of
the diff.

Pick the bump level by what it means for someone depending on the package:

| Bump | When |
| --- | --- |
| `patch` | Bug fixes, docs, internal changes — nothing consumers must react to |
| `minor` | New rules, new exports, new options — additive and backwards compatible |
| `major` | Anything that can break a consuming project: removed or renamed exports, stricter defaults that newly fail a build |

For a shared config package, tightening a lint rule from `warn` to `error` is a
**major** change — it breaks builds that were previously green.

Changes that do not affect the published artifact — CI config, the root README,
tests, tooling in `scripts/` — need no changeset. If you skip one on purpose,
that is fine; nothing forces you to add one.

To check what is currently queued up:

```sh
pnpm changeset status
```

### 2. The version PR (automatic)

When commits land on `main`, the [release workflow](.github/workflows/release.yml)
runs. If any changesets are pending, it opens (or updates) a PR titled
**`chore: version packages`** that:

- bumps every affected `package.json` version,
- writes or extends each package's `CHANGELOG.md`,
- deletes the consumed `.changeset/*.md` files.

Do not edit versions in that PR. If a changelog entry reads badly, fix the
original changeset file on `main` — the PR regenerates itself.

The PR accumulates. Merging five feature PRs first and the version PR once
afterwards results in a single release containing all five entries, which is
usually what you want.

### 3. Publish (automatic, on merging the version PR)

Merging the version PR triggers the workflow again. This time no changesets are
left, so it takes the publish path instead:

- `scripts/publish-workspace.mjs` publishes every non-private workspace package
  whose exact version is not yet on the registry,
- `pnpm changeset tag` creates the git tags and pushes them.

Authentication uses npm **trusted publishing** over OIDC — there is no npm token
in the repository secrets. The trust relationship is configured per package on
npmjs.com (Settings → Trusted Publisher), pointing at this repository and
`release.yml`.

> The publish step deliberately uses `npm publish` rather than
> `changeset publish`. Changesets detects the pnpm lockfile and shells out to
> `pnpm publish`, which does not support OIDC.

Trusted publishing attaches a **provenance statement** to every release, which
npm validates against the package metadata. Each published package therefore
needs a `repository` field pointing at this monorepo, including the `directory`
it lives in:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tobia-codes/trailpack-react.git",
    "directory": "packages/<name>"
  }
}
```

Without it the upload is rejected with `E422 — Failed to validate repository
information`, *after* the provenance has already been signed.

### Trying it locally

The version step is fully reversible, so you can rehearse it before pushing:

```sh
pnpm changeset                              # create a changeset
pnpm changeset version                      # bump + changelog, locally
node scripts/publish-workspace.mjs --dry-run  # show what would be published
git checkout . && git clean -fd .changeset  # undo all of it
```

`npm pack --dry-run` inside a package directory lists the exact files that would
end up in the tarball — worth checking whenever the `files` or `exports` field
changes.

### Publishing a new package for the first time

Trusted publishing can only be configured on a package that already exists on
npm. For a brand new package, publish version `0.0.x` once manually
(`npm publish` from the package directory), then set up the trusted publisher on
npmjs.com. Every release after that runs through CI.

> npm refuses to run any command from the repository root, because the root
> `package.json` declares `devEngines.packageManager = pnpm` and exits with
> `EBADDEVENGINES`. Run `npm` commands from inside a package directory.
