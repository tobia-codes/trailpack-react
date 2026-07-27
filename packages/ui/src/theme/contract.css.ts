import { createGlobalThemeContract } from '@vanilla-extract/css';

/**
 * The token contract: the shape of the theme and the CSS variable names, but
 * no values. Consumers can reference `vars.color.accent` in their own `.css.ts`
 * files, and can override any variable without importing anything from here —
 * the names are stable and prefixed, not hashed.
 */
export const vars = createGlobalThemeContract(
  {
    color: {
      background: '',
      surface: '',
      surfaceRaised: '',
      border: '',
      text: '',
      textMuted: '',
      accent: '',
      accentHover: '',
      accentText: '',
      focus: '',
    },
    space: {
      none: '',
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    radius: {
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
    font: {
      body: '',
      mono: '',
    },
    fontSize: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    fontWeight: {
      regular: '',
      medium: '',
      bold: '',
    },
    lineHeight: {
      tight: '',
      normal: '',
    },
  },
  // Kebab-cased so the public variable names read like CSS, not like JS:
  // `--tp-color-surface-raised`, not `--tp-color-surfaceRaised`. These names are
  // part of the package's API — consumers override them by hand.
  (_value, path) =>
    `tp-${path.map((segment) => segment.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()).join('-')}`,
);
