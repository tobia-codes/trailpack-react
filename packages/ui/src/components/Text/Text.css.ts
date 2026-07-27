import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const text = recipe({
  base: {
    margin: 0,
    fontFamily: vars.font.body,
    color: vars.color.text,
  },

  variants: {
    size: {
      sm: { fontSize: vars.fontSize.sm },
      md: { fontSize: vars.fontSize.md },
      lg: { fontSize: vars.fontSize.lg },
      xl: { fontSize: vars.fontSize.xl },
    },

    weight: {
      regular: { fontWeight: vars.fontWeight.regular },
      medium: { fontWeight: vars.fontWeight.medium },
      bold: { fontWeight: vars.fontWeight.bold },
    },

    tone: {
      default: { color: vars.color.text },
      muted: { color: vars.color.textMuted },
      accent: { color: vars.color.accent },
    },

    leading: {
      tight: { lineHeight: vars.lineHeight.tight },
      normal: { lineHeight: vars.lineHeight.normal },
    },

    mono: {
      true: { fontFamily: vars.font.mono },
    },
  },

  defaultVariants: {
    size: 'md',
    weight: 'regular',
    tone: 'default',
    leading: 'normal',
  },
});
