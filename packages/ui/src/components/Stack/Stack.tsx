import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/cx';
import { stack } from './Stack.css';

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
  direction?: 'row' | 'column';
  /** Spacing between children, from the `space` scale. */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}

export function Stack({
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  ...rest
}: StackProps) {
  return (
    <div
      className={cx(stack({ direction, gap, align, justify, wrap }), className)}
      {...rest}
    />
  );
}
