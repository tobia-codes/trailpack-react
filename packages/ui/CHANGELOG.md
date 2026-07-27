# @trailpack/react-ui

## 0.2.0

### Minor Changes

- 3a3ed33: Remove the `Stack` and `Text` components. `Stack`, `StackProps`, `Text` and
  `TextProps` are no longer exported, and their styles are gone from
  `styles.css`.

  Replace `Stack` with a flex container of your own, and `Text` with the
  appropriate semantic element. Both can be rebuilt on the token contract from
  `@trailpack/react-ui/theme` — for example `vars.space.md` for the gap that
  `<Stack gap="md">` used to apply, and `vars.fontSize.*` / `vars.color.*` for
  what `Text` set.

## 0.1.0

### Minor Changes

- 0305b5e: Initial release: a vanilla-extract token contract with light and dark themes,
  and the `Button`, `Stack` and `Text` base components.

  Tokens ship as plain `var(--tp-*)` references, so consuming apps need no
  vanilla-extract setup unless they write their own `.css.ts` files. Import
  `@trailpack/react-ui/styles.css` once at the root of the app; apply the `darkTheme`
  class from `@trailpack/react-ui/theme` to any element to switch its subtree.
