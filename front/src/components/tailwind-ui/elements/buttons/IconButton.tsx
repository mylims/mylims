import { PencilAltIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from 'react';

import { Color } from '../../types';
import { WithTooltip, WithTooltipProps } from '../popper/WithTooltip';

type IconButtonSize = '4' | '5' | '6';
type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface IconButtonProps
  extends Omit<ButtonProps, 'title'>,
    WithTooltipProps {
  size: IconButtonSize;
  icon?: ReactNode;
  color?: Color | 'none';
}

const colors: Record<Color, string> = {
  primary: 'text-primary-600',
  neutral: 'text-neutral-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
  alternative: 'text-alternative-600',
};

const sizes: Record<IconButtonSize, string> = {
  4: 'h-4 w-4',
  5: 'h-5 w-5',
  6: 'h-6 w-6',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButtonInternal(props: IconButtonProps, ref) {
    const {
      onClick,
      size,
      icon = <PencilAltIcon />,
      color = Color.neutral,
      className,
      style,

      tooltip,
      tooltipDelay,
      tooltipPlacement,

      ...others
    } = props;

    return (
      <WithTooltip
        tooltip={tooltip}
        tooltipDelay={tooltipDelay}
        tooltipPlacement={tooltipPlacement}
      >
        <button
          type="button"
          ref={ref}
          onClick={onClick}
          style={style}
          className={clsx(color !== 'none' && colors[color], className)}
          {...others}
        >
          <div className={sizes[size]}>{icon}</div>
        </button>
      </WithTooltip>
    );
  },
);
