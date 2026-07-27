import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/themes.css';

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: `1px solid transparent`,
    borderRadius: vars.radius.md,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    cursor: 'pointer',
    transition: 'background-color 120ms ease, border-color 120ms ease',
    selectors: {
      '&:focus-visible': {
        outline: `${vars.focusRing.width} solid ${vars.color.ring}`,
        outlineOffset: vars.focusRing.offset,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },

  variants: {
    // Only the filled variant reads from `vars.tone`; `neutral` and `ghost` are
    // chrome, not a tone. A component that does vary across all six — a Badge,
    // an Alert — can index `vars.tone[name]` rather than listing them.
    tone: {
      accent: {
        backgroundColor: vars.tone.accent.solid,
        color: vars.tone.accent.onSolid,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.tone.accent.solidHover },
          '&:active:not(:disabled)': { backgroundColor: vars.tone.accent.solidActive },
        },
      },
      neutral: {
        backgroundColor: vars.color.surface,
        borderColor: vars.color.border,
        color: vars.color.foreground,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.muted },
          '&:active:not(:disabled)': {
            backgroundColor: vars.color.muted,
            borderColor: vars.color.borderStrong,
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.foreground,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: vars.color.muted },
          '&:active:not(:disabled)': { backgroundColor: vars.color.border },
        },
      },
    },

    size: {
      sm: {
        fontSize: vars.font.size.sm,
        padding: `${vars.space[1]} ${vars.space[2]}`,
      },
      md: {
        fontSize: vars.font.size.md,
        padding: `${vars.space[2]} ${vars.space[4]}`,
      },
      lg: {
        fontSize: vars.font.size.lg,
        padding: `${vars.space[2]} ${vars.space[6]}`,
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
