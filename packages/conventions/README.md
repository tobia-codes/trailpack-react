# @trailpack/react-codeconventions

Shared, minimal [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter)
configuration for Trailpack React projects. Install once, extend per project.

The base config is intentionally the **absolute minimum** — the `react` plugin
with the `correctness` category as errors, plus a small formatting style. Each
consuming project layers its own plugins and rules on top.

## Install

`oxlint` (and optionally `oxfmt`) are **peer dependencies** — the consuming
project owns their versions, so you can bump them or add plugins independently.

```sh
pnpm add -D @trailpack/react-codeconventions oxlint oxfmt
```

## Linting (oxlint)

Create `.oxlintrc.json` in the consuming project. `extends` takes a file path
into `node_modules`, then add your own `plugins` / `rules` on top — later values
win, so you can extend or override anything in the base:

```json
{
  "extends": ["./node_modules/@trailpack/react-codeconventions/oxlintrc.json"],
  "plugins": ["react", "typescript", "jsx-a11y"],
  "rules": {
    "no-console": "warn"
  }
}
```

Run it:

```json
{
  "scripts": {
    "lint": "oxlint"
  }
}
```

> Prefer a TypeScript config? oxlint also supports importing this package
> directly from `oxlint.config.ts`:
>
> ```ts
> import { defineConfig } from 'oxlint';
> import base from '@trailpack/react-codeconventions/oxlint' with { type: 'json' };
>
> export default defineConfig({ extends: [base] });
> ```

## Formatting (oxfmt)

oxfmt has no `extends`, so it never picks up this package on its own. You
**always** need an `oxfmt.config.mts` in the project — that file is what pulls in
the shared config. oxfmt auto-discovers it (CLI **and** editor format-on-save),
so no `-c` flag is needed.

Create `oxfmt.config.mts` — this is the minimum required to use the config:

```ts
// oxfmt.config.mts
import base from '@trailpack/react-codeconventions/oxfmt' with { type: 'json' };

export default base;
```

Add the scripts:

```json
{
  "scripts": {
    "format": "oxfmt .",
    "format:check": "oxfmt --check ."
  }
}
```

That's it. If you additionally want to override something in *this* project,
spread the base in the same file instead of exporting it directly:

```ts
import base from '@trailpack/react-codeconventions/oxfmt' with { type: 'json' };

export default { ...base, printWidth: 120 };
```
