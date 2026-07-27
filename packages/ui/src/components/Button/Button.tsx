import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/cx';
import { button } from './Button.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual weight. `accent` is the primary action. */
  tone?: 'accent' | 'neutral' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  tone,
  size,
  fullWidth,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type -- defaulted above
      type={type}
      className={cx(button({ tone, size, fullWidth }), className)}
      {...rest}
    />
  );
}
