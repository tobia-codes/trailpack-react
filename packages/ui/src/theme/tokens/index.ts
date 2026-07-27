/**
 * The token values, split by what changes: `shared` holds the scales that are
 * the same in every theme, `light` and `dark` hold the palettes. Importers take
 * the whole set from here, so the split stays an internal detail.
 */
export { darkTokens } from './dark';
export { lightTokens, type ThemeTokens, type ToneName } from './light';
