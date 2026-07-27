import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
    border: `1px solid transparent`,
    borderRadius: vars.radius.md,
    fontFamily: vars.font.body,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.tight,
    cursor: 'pointer',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${vars.color.focus}`,
        outlineOffset: '2px',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },

  variants: {
    tone: {
      accent: {
        backgroundColor: vars.color.accent,
        color: vars.color.accentText,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.accentHover },
        },
      },
      neutral: {
        backgroundColor: vars.color.surface,
        borderColor: vars.color.border,
        color: vars.color.text,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.surfaceRaised },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.text,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.surface },
        },
      },
    },

    size: {
      sm: {
        fontSize: vars.fontSize.sm,
        padding: `${vars.space.xs} ${vars.space.sm}`,
      },
      md: {
        fontSize: vars.fontSize.md,
        padding: `${vars.space.sm} ${vars.space.md}`,
      },
      lg: {
        fontSize: vars.fontSize.lg,
        padding: `${vars.space.sm} ${vars.space.lg}`,
      },
    },

    fullWidth: {
      true: { width: '100%' },
    },
  },

  defaultVariants: {
    tone: 'accent',
    size: 'md',
  },
});
