# @trailpack/react-ui

React component library for Trailpack projects, styled with
[vanilla-extract](https://vanilla-extract.style). Ships a token contract, a
light and a dark theme, and a small set of base components.

## Install

```sh
pnpm add @trailpack/react-ui react react-dom
```

`react` and `react-dom` are peer dependencies — the consuming app owns their
versions.

**vanilla-extract is not required in the consuming app.** The `.css.ts` files
are evaluated here at build time; what ships is a plain stylesheet plus a token
object holding `var(--tp-…)` strings. Components and tokens work in any React
setup, with no bundler plugin and no vanilla-extract package.

You only need vanilla-extract in your app if you want to write your *own*
`.css.ts` files against these tokens — and then it is your dependency, on your
terms, not something this package imposes. See [Tokens](#tokens).

## Usage

Import the stylesheet once, at the root of your app. It carries the compiled
component styles *and* the light theme applied to `:root`:

```tsx
import '@trailpack/react-ui/styles.css';
import { Button } from '@trailpack/react-ui';

export function Example() {
  return <Button tone="accent">Add item</Button>;
}
```

## Dark mode

Dark mode is a class you put on any element; everything below it switches.

```tsx
import { darkTheme } from '@trailpack/react-ui/theme';

<div className={darkTheme}>
  {/* tokens resolve to their dark values in here */}
</div>
```

Apply it to `<html>` for a whole-app switch, or to a subtree to invert just one
section.

## Tokens

`vars` is the token contract — an object of CSS variable references, usable in
your own `.css.ts` files:

```ts
// Card.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '@trailpack/react-ui/theme';

export const card = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
});
```

That snippet is the one case where the app needs its own vanilla-extract setup
(`@vanilla-extract/css` plus a bundler plugin) — because `style()` comes from
there, not from here.

Because `vars` holds plain `var(--tp-…)` strings, it also works in inline styles
and plain CSS, with nothing installed. The variable names are stable and part of
this package's public API, so you can override them without importing anything:

```css
:root {
  --tp-color-accent: #b4530a;
  --tp-radius-md: 0;
}
```

Available scales: `color`, `space`, `radius`, `font`, `fontSize`, `fontWeight`,
`lineHeight`.

## Components

| Component | Notable props |
| --- | --- |
| `Button` | `tone` (`accent`/`neutral`/`ghost`), `size`, `fullWidth` |

It forwards the remaining DOM props and merges an incoming `className`.

## Development

```sh
pnpm dev              # Storybook on :6006
pnpm build            # dist/ — bundle, stylesheet and declarations
pnpm lint
pnpm storybook:build  # static Storybook in storybook-static/
```

Storybook has a light/dark toggle in the toolbar that applies `darkTheme` to the
story canvas, so components can be checked against both themes.

### Why Vite library mode

vanilla-extract evaluates `.css.ts` modules at build time, which needs a real
bundler plugin. The Vite plugin is the officially maintained one, and Storybook
already runs on Vite here — so the alternative (tsdown, on Rolldown) would mean
a second build pipeline plus a vanilla-extract integration that does not exist
as a Rolldown plugin yet.
