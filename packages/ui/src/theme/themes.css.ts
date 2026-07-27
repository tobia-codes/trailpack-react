import { createGlobalTheme, createTheme } from '@vanilla-extract/css';
import { vars } from './contract.css';

const shared = {
  space: {
    none: '0',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  font: {
    body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  },
  fontSize: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.6',
  },
};

/**
 * The light theme is applied globally, so consuming apps get a working theme
 * from importing the stylesheet alone. Dark mode is opt-in via `darkTheme`.
 */
createGlobalTheme(':root', vars, {
  ...shared,
  color: {
    background: '#ffffff',
    surface: '#f6f7f9',
    surfaceRaised: '#ffffff',
    border: '#d8dce2',
    text: '#14171a',
    textMuted: '#5c6570',
    accent: '#2f6fed',
    accentHover: '#2559c4',
    accentText: '#ffffff',
    focus: '#2f6fed',
  },
});

/** Class name that swaps the token values below in for its subtree. */
export const darkTheme = createTheme(vars, {
  ...shared,
  color: {
    background: '#0f1216',
    surface: '#171b21',
    surfaceRaised: '#1e242c',
    border: '#2c333c',
    text: '#f2f4f7',
    textMuted: '#9aa4b1',
    accent: '#5c92ff',
    accentHover: '#7aa8ff',
    accentText: '#0f1216',
    focus: '#5c92ff',
  },
});
