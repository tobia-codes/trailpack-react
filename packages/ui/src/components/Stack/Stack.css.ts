import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../theme/contract.css';

export const stack = recipe({
  base: {
    display: 'flex',
    minWidth: 0,
  },

  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },

    gap: {
      none: { gap: vars.space.none },
      xs: { gap: vars.space.xs },
      sm: { gap: vars.space.sm },
      md: { gap: vars.space.md },
      lg: { gap: vars.space.lg },
      xl: { gap: vars.space.xl },
    },

    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },

    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },

    wrap: {
      true: { flexWrap: 'wrap' },
    },
  },

  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
  },
});
