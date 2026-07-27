# AGENTS.md

Guidance for AI agents working in this repository. Read this before making
changes; it documents conventions and pitfalls that are not obvious from the
code alone.

## What this is

A pnpm workspace monorepo for the Trailpack React toolchain, orchestrated with
Turborepo. Packages are versioned with Changesets and published to npm under the
`@trailpack` scope from GitHub Actions, using OIDC trusted publishing — there is
no npm token anywhere in the repository or its secrets.

## Layout

```
packages/*          publishable packages (currently: conventions)
apps/*              applications (none yet, but part of the workspace globs)
scripts/            release tooling
.changeset/         pending changesets + config
.github/workflows/  release pipeline
```

The root `package.json` is `private: true` and is never published.

## Environment

- **pnpm 11** and **Node 24**. Always use `pnpm` to install and run scripts.
- Never run `npm install` or `yarn` — it would produce a competing lockfile.

## Critical: npm cannot run from the repository root

The root `package.json` declares `devEngines.packageManager = pnpm`. As a
result **every** `npm` command invoked with the repository root as its working
directory exits with `EBADDEVENGINES`, including read-only ones:

```sh
npm view react version        # from the root      → exit 1, EBADDEVENGINES
cd packages/conventions && npm view react version  # → exit 0
```

Always `cd` into a package directory before running `npm`. This is a real
constraint, not a style preference: it has already broken the release pipeline
twice. `scripts/publish-workspace.mjs` passes an explicit `cwd` for exactly this
reason — do not remove it.

## Commands

```sh
pnpm install                 # install everything
pnpm build                   # turbo run build
pnpm lint                    # turbo run lint
pnpm test                    # turbo run test
pnpm changeset               # record a change for the next release
pnpm changeset status        # show what is queued for the next release
```

## Two rules that apply to every change

Everything else about packaging and releasing lives in the skills below. These
two are here because they are easy to violate while working on something else
entirely:

- **Never edit a `version` field by hand.** Versions are derived from changesets;
  a manual bump desynchronises the pipeline. See the release skill.
- **Never remove `repository`, `publishConfig` or `files` from a published
  package's `package.json`.** Each one causes a failure only much later, at
  publish time. See the new-package skill for what they do.

Packages marked `"private": true` are skipped by the release script and are
exempt from both.

## Skills

The release flow is also documented for humans in [README.md](README.md); the
skills below are the version written for agents.


Skills are a Claude Code feature and are loaded automatically by Claude. **Agents
that do not support skills — Antigravity, Copilot and others — should read these
files directly as plain Markdown**; the paths are listed here for that purpose.

| Skill | Read it when |
| --- | --- |
| [`.claude/skills/release/SKILL.md`](.claude/skills/release/SKILL.md) | Cutting a release, adding or editing a changeset, choosing a bump level, touching `release.yml` or `scripts/publish-workspace.mjs`, or diagnosing a failed publish |
| [`.claude/skills/new-package/SKILL.md`](.claude/skills/new-package/SKILL.md) | Adding a new package to `packages/*`, especially one that will be published to npm — the first publish of a package cannot go through CI and needs a specific manual sequence |

Do not duplicate the contents of a skill into a commit message, a PR
description, or this file. Link to it instead, so there is one source of truth.
