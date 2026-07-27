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
object holding `var(--…)` strings. Components and tokens work in any React
setup, with no bundler plugin and no vanilla-extract package.

You only need vanilla-extract in your app if you want to write your _own_
`.css.ts` files against these tokens — and then it is your dependency, on your
terms, not something this package imposes. See [Tokens](#tokens).

## Usage

Import the stylesheet once, at the root of your app. It carries the compiled
component styles _and_ the light theme applied to `:root`:

```tsx
import '@trailpack/react-ui/styles.css';
import { Button } from '@trailpack/react-ui';

export function Example() {
  return <Button tone="accent">Add item</Button>;
}
```

If you only want the tokens — a package that styles itself against them and
never renders a component from here — import the theme stylesheet instead. It is
the same `:root` declarations without the component rules:

```ts
import '@trailpack/react-ui/theme.css';
```

Import one or the other, not both: `styles.css` already contains everything
`theme.css` does.

## Dark mode

Dark mode is a class you put on any element; everything below it switches.

```tsx
import { darkTheme } from '@trailpack/react-ui/theme';

<div className={darkTheme}>{/* tokens resolve to their dark values in here */}</div>;
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
  padding: vars.space[6],
  boxShadow: vars.shadow.sm,
});
```

That snippet is the one case where the app needs its own vanilla-extract setup
(`@vanilla-extract/css` plus a bundler plugin) — because `style()` comes from
there, not from here.

Because `vars` holds plain `var(--…)` strings, it also works in inline styles,
with nothing installed:

```tsx
<div style={{ background: vars.tone.info.subtle, color: vars.tone.info.onSubtle }} />
```

The variable names themselves are vanilla-extract's hashes, so they are not
meant to be typed out in a hand-written stylesheet — go through `vars`.

The set is meant to be complete enough to style a whole application with,
without reaching for a hex value.

| Scale       | Keys                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `color`     | `background`, `foreground`, `surface`, `muted`, `mutedForeground`, `border`, `borderStrong`, `ring`, `overlay` |
| `tone`      | `accent`, `neutral`, `danger`, `success`, `warning`, `info` — see below                                        |
| `space`     | `0`–`24`, numeric: the key × 4px, in `rem`                                                                     |
| `radius`    | `xs`, `sm`, `md`, `lg`, `xl`, `full`                                                                           |
| `iconSize`  | `sm`, `md`, `lg`, `xl`                                                                                         |
| `focusRing` | `width`, `offset` (the colour is `color.ring`)                                                                 |
| `font`      | `family`, `size`, `weight`, `lineHeight`, `letterSpacing`                                                      |
| `shadow`    | `xs`, `sm`, `md`, `lg`, `xl`                                                                                   |
| `zIndex`    | `base`, `dropdown`, `sticky`, `overlay`, `modal`, `popover`, `toast`                                           |

### Tones

A tone is one meaning — brand, danger, success — in all the forms a component
needs it. Every tone has the same nine steps, so anything that varies across
tones can be written once:

| Step                                 | For                                           |
| ------------------------------------ | --------------------------------------------- |
| `solid`, `solidHover`, `solidActive` | filled button or badge background             |
| `onSolid`                            | text and icons on those                       |
| `subtle`, `subtleHover`              | soft alert or badge fill                      |
| `onSubtle`                           | text on those                                 |
| `text`                               | the tone as text on a page surface            |
| `border`                             | outline of a subtle fill, or a tinted divider |

`text` is separate from `solid` on purpose: `tone.warning.solid` is an amber
that sits at roughly 2:1 on white, so an inline validation message needs its own
value. Every pairing in that table is asserted against WCAG AA in
`src/theme/themes.test.ts`, in both themes.

Because the steps are nested under the tone rather than flattened into
`accentSubtle` / `dangerSubtle`, a component can take the tone as a value and
index into it. `ToneName` is exported for that:

```tsx
import { type ToneName, vars } from '@trailpack/react-ui/theme';

export function Callout({ tone = 'info' }: { tone?: ToneName }) {
  return (
    <div
      style={{
        background: vars.tone[tone].subtle,
        color: vars.tone[tone].onSubtle,
        border: `1px solid ${vars.tone[tone].border}`,
      }}
    />
  );
}
```

The paths on `vars` are the public API; the variable names behind them are not,
and can change between releases. Overriding tokens to build a custom theme is
not supported yet — `createTheme` requires the whole contract, and there is no
helper for producing one.

## Components

| Component | Notable props                                            |
| --------- | -------------------------------------------------------- |
| `Button`  | `tone` (`accent`/`neutral`/`ghost`), `size`, `fullWidth` |

It forwards the remaining DOM props and merges an incoming `className`.

## Development

```sh
pnpm dev              # Storybook on :6006
pnpm build            # dist/ — bundle, stylesheet and declarations
pnpm lint
pnpm test             # contrast assertions over both themes
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
