---
name: new-package
description: How to add a new package to packages/* in this monorepo, including the metadata npm provenance requires and the manual first publish that trusted publishing cannot do on its own. Use when creating a new workspace package or preparing an existing one for its first npm release.
---

# Adding a package

Workspaces are globbed from `packages/*` and `apps/*`, so a new directory with a
`package.json` is picked up by `pnpm install` without any registration step.

## Internal (non-published) packages

Mark them `"private": true`. `scripts/publish-workspace.mjs` filters on that
field, so nothing further is required — no changeset, no npm setup.

## Published packages

Scaffold `packages/<name>/package.json` with all of the following. Each entry
prevents a specific, previously observed failure:

```json
{
  "name": "@trailpack/<name>",
  "version": "0.0.0",
  "description": "...",
  "license": "ISC",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tobia-codes/trailpack-react.git",
    "directory": "packages/<name>"
  },
  "homepage": "https://github.com/tobia-codes/trailpack-react/tree/main/packages/<name>",
  "bugs": "https://github.com/tobia-codes/trailpack-react/issues",
  "publishConfig": { "access": "public" },
  "files": ["dist"],
  "exports": { ".": "./dist/index.js" }
}
```

- `repository` is **mandatory**. OIDC publishing attaches a provenance statement
  that npm validates against this field; without it the upload is rejected with
  `E422` after the signature has already been issued.
- `publishConfig.access: public` is required for scoped packages — the default
  is restricted, which fails on a free account.
- `files` is the allowlist for the tarball. Verify with `npm pack --dry-run`
  from inside the package directory. `README.md`, `LICENSE` and `package.json`
  are always included regardless.
- Anything the consuming project should own — React, linters, formatters —
  belongs in `peerDependencies`, with a `devDependencies` entry for local
  development.

Then run `pnpm install` from the root so the workspace link is created.

## The first publish is manual

**A trusted publisher can only be configured on a package that already exists on
npm.** There is no settings page for a name nobody has claimed, so the very
first version cannot come from CI:

1. Ensure the `@trailpack` org exists on npmjs.com and you can publish to it.
2. From **inside the package directory** (npm cannot run from the repository
   root — see the release skill), publish once by hand:
   ```sh
   cd packages/<name>
   npm publish
   ```
3. On npmjs.com, open the package → Settings → Trusted Publisher, and point it
   at the repository `tobia-codes/trailpack-react` with workflow filename
   `release.yml` — the filename, not the workflow's display name.
4. Every release from then on goes through the normal changeset flow.

That first hand-published version has no provenance attestation; versions
released through CI afterwards do. A missing provenance badge on the oldest
version is expected and not a defect.

## After the package exists

Add a changeset for it like any other change, and add a row to the package table
in the root `README.md`.
