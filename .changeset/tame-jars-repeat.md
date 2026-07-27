---
"@trailpack/react-ui": minor
---

Remove the `Stack` and `Text` components. `Stack`, `StackProps`, `Text` and
`TextProps` are no longer exported, and their styles are gone from
`styles.css`.

Replace `Stack` with a flex container of your own, and `Text` with the
appropriate semantic element. Both can be rebuilt on the token contract from
`@trailpack/react-ui/theme` — for example `vars.space.md` for the gap that
`<Stack gap="md">` used to apply, and `vars.fontSize.*` / `vars.color.*` for
what `Text` set.
