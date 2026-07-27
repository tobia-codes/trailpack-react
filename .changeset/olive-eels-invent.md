---
"@trailpack/react-ui": patch
---

Prerelease builds can now be published from any branch, on demand, under an npm
dist-tag derived from the branch name:

```sh
pnpm add @trailpack/react-ui@stage
```

They are snapshot versions (`0.0.0-<branch>-<timestamp>`) and never move
`latest`, so a plain install is unaffected. Nothing about the package itself
changes with this release.
