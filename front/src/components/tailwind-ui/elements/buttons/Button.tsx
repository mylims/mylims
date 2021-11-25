import React, { forwardRef, ReactNode } from 'react';

import { Color, Roundness, Size, Variant } from '../../types';

import { getButtonClassName } from './utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit';
  color?: Color;
  size?: Size;
  variant?: Variant;
  roundness?: Roundness;
  group?: 'left' | 'right' | 'middle';
  noBorder?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonForwardRef(props, ref) {
    const {
      color = Color.primary,
      size = Size.medium,
      variant = Variant.primary,
      group,
      children,
      type = 'button',
      roundness = Roundness.light,
      className,
      noBorder = false,
      ...otherProps
    } = props;

    return (
      <button
        type={type === 'submit' ? 'submit' : 'button'}
        {...otherProps}
        ref={ref}
        className={getButtonClassName({
          variant,
          roundness,
          color,
          group,
          noBorder,
          size,
          disabled: props.disabled,
          className,
        })}
      >
        {children}
      </button>
    );
  },
);
