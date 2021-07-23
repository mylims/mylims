import clsx from 'clsx';
import React, { ReactNode, Ref } from 'react';

import { Color, Roundness, Size, Variant } from '../../types';
import { forwardRefWithAs } from '../../util';

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
  ref?: Ref<HTMLButtonElement>;
}

export const Button = forwardRefWithAs(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
      color = Color.primary,
      size = Size.medium,
      variant = Variant.primary,
      group,
      children,
      type = 'button',
      roundness = Roundness.light,
      className,
      ...otherProps
    } = props;

    return (
      <button
        type={type === 'submit' ? 'submit' : 'button'}
        {...otherProps}
        ref={ref}
        className={clsx(
          'font-semibold text-white focus:outline-none',
          getVariantColor(variant, color),
          roundness === Roundness.circular
            ? circularSizes[size]
            : baseSizes[size],
          className,
          {
            'cursor-default': props.disabled,
            'rounded-l-md': group === 'left',
            '-ml-px': group && group !== 'left',
            'rounded-r-md': group === 'right',
            'rounded-md shadow-sm focus:ring-2 focus:ring-offset-2': !group,
            'focus:ring-1 focus:z-10': group,
            'rounded-full':
              roundness === Roundness.full || roundness === Roundness.circular,
          },
        )}
      >
        {children}
      </button>
    );
  },
);
