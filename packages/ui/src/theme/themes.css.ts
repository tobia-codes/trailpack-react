import { createGlobalTheme, createTheme } from '@vanilla-extract/css';
import { darkTokens, lightTokens } from './tokens';

/**
 * The token contract and the light theme in one call: `createGlobalTheme`
 * declares the variables on `:root` and returns the object that references
 * them, so a consuming app gets a complete, working theme from importing the
 * stylesheet alone. Dark mode is opt-in.
 *
 * The variable names are vanilla-extract's own hashes — `--b8impg37`, not
 * `--tp-tone-danger-text`. Tokens are meant to be read through `vars` from a
 * `.css.ts` file; nothing depends on the names being legible or stable.
 *
 * The shape comes from `lightTokens` rather than being written out again, so
 * the contract and the values cannot drift: a token added in `tokens.ts` is a
 * variable here on the next build, one removed is a type error at every use.
 */
export const vars = createGlobalTheme(':root', lightTokens);

/** Class name that swaps in the dark token values for its subtree. */
export const darkTheme = createTheme(vars, darkTokens);
