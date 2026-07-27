import type { ElementType, HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { text } from './Text.css';

type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'label';

// Deliberately typed against the generic HTMLElement rather than one specific
// tag: the props below have to be valid for every element `as` accepts, and
// per-element handler types (HTMLParagraphElement vs HTMLLabelElement) are not
// mutually assignable.
export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element. Pick it for document semantics, not for size. */
  as?: TextElement;
  /** Only meaningful together with `as="label"`. */
  htmlFor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'bold';
  tone?: 'default' | 'muted' | 'accent';
  leading?: 'tight' | 'normal';
  mono?: boolean;
}

export function Text({
  as = 'p',
  size,
  weight,
  tone,
  leading,
  mono,
  className,
  ...rest
}: TextProps) {
  const Component = as as ElementType;

  return (
    <Component
      className={cx(text({ size, weight, tone, leading, mono }), className)}
      {...rest}
    />
  );
}
