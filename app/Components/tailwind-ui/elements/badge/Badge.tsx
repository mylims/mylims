import clsx from 'clsx';
import React, { CSSProperties, MouseEvent, ReactNode } from 'react';

import { Color } from '../../types';

export enum BadgeSize {
  SMALL = 'small',
  LARGE = 'large',
}

export interface BadgeProps {
  label: ReactNode;
  color: Color;
  size?: BadgeSize;
  dot?: boolean;
  rounded?: boolean;

  onDismiss?: (event: MouseEvent) => void;

  className?: string;
  style?: CSSProperties;
}

const colors = {
  [Color.neutral]: 'bg-neutral-100 text-neutral-800',
  [Color.alternative]: 'bg-alternative-100 text-alternative-800',
  [Color.danger]: 'bg-danger-100 text-danger-800',
  [Color.primary]: 'bg-primary-100 text-primary-800',
  [Color.success]: 'bg-success-100 text-success-800',
  [Color.warning]: 'bg-warning-100 text-warning-800',
};

const dotColors = {
  [Color.neutral]: 'text-neutral-400',
  [Color.alternative]: 'text-alternative-400',
  [Color.danger]: 'text-danger-400',
  [Color.primary]: 'text-primary-400',
  [Color.success]: 'text-success-400',
  [Color.warning]: 'text-warning-400',
};

const removeColors = {
  [Color.neutral]:
    'text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 focus:bg-neutral-500',
  [Color.alternative]:
    'text-alternative-400 hover:bg-alternative-200 hover:text-alternative-500 focus:bg-alternative-500',
  [Color.danger]:
    'text-danger-400 hover:bg-danger-200 hover:text-danger-500 focus:bg-danger-500',
  [Color.primary]:
    'text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500',
  [Color.success]:
    'text-success-400 hover:bg-success-200 hover:text-success-500 focus:bg-success-500',
  [Color.warning]:
    'text-warning-400 hover:bg-warning-200 hover:text-warning-500 focus:bg-warning-500',
};

const paddings = {
  [BadgeSize.SMALL]: {
    basic: 'px-2.5 py-0.5',
    rounded: 'px-2 py-0.5',
    remove: 'py-0.5 pl-2 pr-0.5',
  },
  [BadgeSize.LARGE]: {
    basic: 'px-3 py-0.5',
    rounded: 'px-2.5 py-0.5',
    remove: 'py-0.5 pl-2.5 pr-1',
  },
};

export function Badge(props: BadgeProps) {
  const {
    size = BadgeSize.SMALL,
    rounded = false,
    dot = false,
    onDismiss,
  } = props;
  const padding = paddings[size];

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold ',
        size === BadgeSize.LARGE ? 'text-sm' : 'text-xs',
        colors[props.color],
        rounded
          ? size === BadgeSize.LARGE
            ? 'rounded-md'
            : 'rounded'
          : 'rounded-full',
        onDismiss ? padding.remove : rounded ? padding.rounded : padding.basic,
        props.className,
      )}
      style={props.style}
    >
      {dot && (
        <svg
          className={clsx(
            'mr-1.5 h-2 w-2',
            dotColors[props.color],
            size === BadgeSize.LARGE ? '-ml-1' : '-ml-0.5',
          )}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
      )}
      {props.label}
      {onDismiss && (
        <button
          type="button"
          onClick={props.onDismiss}
          className={clsx(
            'flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center focus:outline-none focus:text-white',
            removeColors[props.color],
          )}
        >
          <svg
            className="w-2 h-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
