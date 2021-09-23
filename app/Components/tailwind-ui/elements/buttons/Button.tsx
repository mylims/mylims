import clsx from 'clsx';
import React, { forwardRef, ReactNode } from 'react';

import { Color, Roundness, Size, Variant } from '../../types';

import { getVariantColor, baseSizes, circularSizes } from './utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit';
  color?: Color;
  size?: Size;
  variant?: Variant;
  roundness?: Roundness;
  group?: string;
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
        className={clsx(
          'font-semibold focus:outline-none',
          getVariantColor(variant, color),
          roundness === Roundness.circular
            ? circularSizes[size]
            : baseSizes[size],
          className,
          roundness === Roundness.full || roundness === Roundness.circular
            ? 'rounded-full'
            : {
                'rounded-l-md rounded-r-none': group === 'left',
                'rounded-none': group === 'middle',
                'rounded-r-md rounded-l-none': group === 'right',
                'rounded-md': !group,
              },
          {
            'cursor-default': props.disabled,
            '-ml-px': group && group !== 'left',
            'shadow-sm focus:ring-2 focus:ring-offset-2': !group,
            'focus:ring-1 focus:z-10': group,
            'border border-transparent': !noBorder && variant !== Variant.white,
            'border border-neutral-300': !noBorder && variant === Variant.white,
          },
        )}
      >
        {children}
      </button>
    );
  },
);
