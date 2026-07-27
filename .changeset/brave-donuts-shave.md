---
"@trailpack/react-ui": minor
---

Rework the token contract. Every path on `vars` has changed, and the token set is
now large enough to style an application with rather than just the components in
this package.

The CSS variable names behind those paths are no longer public. They were
`--tp-color-text` and the like; they are now vanilla-extract's own hashes
(`--b8impg37`), and they can change between releases. Read the tokens through
`vars` instead — in your own `.css.ts` files, or in inline styles, where `vars`
holds the `var(--…)` reference for you. A hand-written stylesheet that names a
`--tp-*` variable, or overrides one on `:root`, no longer works.

Page-level neutrals stay flat, but several were renamed:

| Before                 | After                  |
| ---------------------- | ---------------------- |
| `color.text`           | `color.foreground`     |
| `color.textMuted`      | `color.mutedForeground` |
| `color.surface`        | `color.muted`          |
| `color.surfaceRaised`  | `color.surface`        |
| `color.focus`          | `color.ring`           |

Anything that carries a meaning — brand, danger, success — moved under `tone`.
Each of `accent`, `neutral`, `danger`, `success`, `warning` and `info` has the
same nine steps, so a component can index `vars.tone[name]` and get all of them:

- `solid`, `solidHover`, `solidActive` — filled button or badge background
- `onSolid` — text and icons on those
- `subtle`, `subtleHover` — soft alert or badge fill
- `onSubtle` — text on those
- `text` — the tone as text on a page surface, for inline validation messages
- `border` — outline of a subtle fill, or a tinted divider

So `color.accent` is now `tone.accent.solid`, `color.accentHover` is
`tone.accent.solidHover`, and `color.accentText` is `tone.accent.onSolid`. The
accent hue changed from blue to violet.

The remaining scales were regrouped and extended:

| Before             | After                    |
| ------------------ | ------------------------ |
| `space.md`         | `space[4]` — numeric, the key × 4px |
| `font.body`        | `font.family.sans`       |
| `fontSize.md`      | `font.size.md`           |
| `fontWeight.bold`  | `font.weight.bold`       |
| `lineHeight.tight` | `font.lineHeight.tight`  |

New: `shadow`, `iconSize`, `zIndex`, `focusRing` (`width` and `offset`; the
colour is `color.ring`), `font.letterSpacing`, `color.borderStrong`, and
`radius.xs` / `radius.xl`. `space` runs `0`–`24` and `font.size` runs `xs`–`3xl`.

`ToneName` is exported from `@trailpack/react-ui/theme` for typing a `tone` prop
of your own. `Button` is unchanged — it still takes `accent`, `neutral` or
`ghost`.

New export: `@trailpack/react-ui/theme.css` is the `:root` token declarations on
their own, for a package that styles itself against the tokens and never renders
a component from here. `styles.css` is unchanged and still contains both halves —
import one or the other, not both.

Both themes are checked against WCAG AA in CI for every foreground/background
pairing the token set promises. That fixed one real defect: secondary text on a
muted fill sat at 4.40:1, below AA, and is now 7.03:1.
