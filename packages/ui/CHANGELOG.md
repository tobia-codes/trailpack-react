# @trailpack/ui

## 0.1.0

### Minor Changes

- 0305b5e: Initial release: a vanilla-extract token contract with light and dark themes,
  and the `Button`, `Stack` and `Text` base components.

  Tokens ship as plain `var(--tp-*)` references, so consuming apps need no
  vanilla-extract setup unless they write their own `.css.ts` files. Import
  `@trailpack/ui/styles.css` once at the root of the app; apply the `darkTheme`
  class from `@trailpack/ui/theme` to any element to switch its subtree.
