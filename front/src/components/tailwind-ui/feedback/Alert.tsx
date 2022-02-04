import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { Color } from '../types';

const closeButtonColors: Record<Color, string> = {
  [Color.primary]:
    'text-primary-500 bg-primary-50 hover:bg-primary-100 active:bg-primary-200 focus:ring-offset-primary-50 focus:ring-primary-600',
  [Color.neutral]:
    'text-neutral-500 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 focus:ring-offset-neutral-50 focus:ring-neutral-600',
  [Color.success]:
    'text-success-500 bg-success-50 hover:bg-success-100 active:bg-success-200 focus:ring-offset-success-50 focus:ring-success-600',
  [Color.warning]:
    'text-warning-500 bg-warning-50 hover:bg-warning-100 active:bg-warning-200 focus:ring-offset-warning-50 focus:ring-warning-600',
  [Color.alternative]:
    'text-alternative-500 bg-alternative-50 hover:bg-alternative-100 active:bg-alternative-200 focus:ring-offset-alternative-50 focus:ring-alternative-600',
  [Color.danger]:
    'text-danger-500 bg-danger-50 hover:bg-danger-100 active:bg-danger-200 focus:ring-offset-danger-50 focus:ring-danger-600',
};

export enum AlertType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface AlertProps {
  type: AlertType;
  title?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const theme = {
  [AlertType.INFO]: {
    theme: {
      background: 'bg-primary-50',
      title: 'text-primary-800',
      text: 'text-primary-700',
    },
    icon: <InformationCircleIcon className="h-5 w-5 text-primary-400" />,
  },
  [AlertType.WARNING]: {
    theme: {
      background: 'bg-warning-50',
      title: 'text-warning-800',
      text: 'text-warning-700',
    },
    icon: <ExclamationIcon className="h-5 w-5 text-warning-400" />,
  },
  [AlertType.ERROR]: {
    theme: {
      background: 'bg-danger-50',
      title: 'text-danger-800',
      text: 'text-danger-700',
    },
    icon: <XCircleIcon className="h-5 w-5 text-danger-400" />,
  },
  [AlertType.SUCCESS]: {
    theme: {
      background: 'bg-success-50',
      title: 'text-success-800',
      text: 'text-success-700',
    },
    icon: <CheckCircleIcon className="h-5 w-5 text-success-400" />,
  },
};

function getColorByType(type: AlertType): Color {
  switch (type) {
    case AlertType.INFO:
      return Color.primary;
    case AlertType.ERROR:
      return Color.danger;
    case AlertType.SUCCESS:
      return Color.success;
    case AlertType.WARNING:
      return Color.warning;
    default:
      throw new Error('type cannot be null');
  }
}

export function Alert(props: AlertProps): JSX.Element {
  const type = theme[props.type];

  return (
    <div
      className={clsx('rounded-md p-4', type.theme.background, props.className)}
    >
      <div className="flex">
        <div className="shrink-0 text-xl">{type.icon}</div>
        <div className="ml-3">
          {props.title && (
            <div className={clsx('text-sm font-semibold', type.theme.title)}>
              {props.title}
            </div>
          )}
          {props.children && (
            <div
              className={clsx(
                'text-sm',
                props.title && 'mt-2',
                type.theme.text,
              )}
            >
              {props.children}
            </div>
          )}
        </div>

        {props.onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={props.onDismiss}
                className={clsx(
                  closeButtonColors[getColorByType(props.type)],
                  'rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                )}
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
