import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { Color } from '..';
import { IconButton } from '../elements/buttons/IconButton';

import { NotificationState } from './NotificationContext';

export interface NotificationProps
  extends Omit<NotificationState, 'content' | 'isToast'> {
  children: ReactNode;
  className?: string;
  onDismiss: () => void;
  isTop: boolean;
}

export function Notification(props: NotificationProps) {
  const { type = Color.neutral } = props;

  return (
    <Transition
      appear
      show={props.state === 'SHOWING'}
      enter="transition ease-out duration-300"
      enterFrom={clsx(
        props.isTop ? '-translate-y-2' : 'translate-y-2',
        'opacity-0',
      )}
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={clsx(
        'pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-md',
        props.className,
        {
          'shadow-neutral-500/25': type === Color.neutral,
          'shadow-danger-500/25': type === Color.danger,
          'shadow-warning-500/25': type === Color.warning,
          'shadow-success-500/25': type === Color.success,
          'shadow-alternative-500/25': type === Color.alternative,
          'shadow-primary-500/25': type === Color.primary,
        },
      )}
    >
      <div
        className={clsx('z-40 overflow-hidden rounded-lg border', {
          'border-neutral-400': type === Color.neutral,
          'border-danger-400': type === Color.danger,
          'border-warning-400': type === Color.warning,
          'border-success-400': type === Color.success,
          'border-alternative-400': type === Color.alternative,
          'border-primary-400': type === Color.primary,
        })}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="h-5 w-5 shrink-0 text-xl text-neutral-600">
              {props.icon}
            </div>
            <div
              className={clsx(
                'ml-3 w-0 flex-1 overflow-hidden text-ellipsis pt-0.5',
                {
                  'text-neutral-500': type === Color.neutral,
                  'text-danger-500': type === Color.danger,
                  'text-warning-500': type === Color.warning,
                  'text-success-500': type === Color.success,
                  'text-alternative-500': type === Color.alternative,
                  'text-primary-500': type === Color.primary,
                },
              )}
            >
              {props.title && (
                <p
                  className={clsx(
                    'overflow-hidden text-ellipsis text-sm font-semibold',
                    {
                      'text-neutral-800': type === Color.neutral,
                      'text-danger-800': type === Color.danger,
                      'text-warning-800': type === Color.warning,
                      'text-success-800': type === Color.success,
                      'text-alternative-800': type === Color.alternative,
                      'text-primary-800': type === Color.primary,
                    },
                  )}
                >
                  {props.title}
                </p>
              )}

              {props.children}
            </div>
            <div className="ml-4 flex shrink-0">
              <IconButton
                className="inline-flex text-neutral-400 transition duration-150 ease-in-out focus:text-neutral-500 focus:outline-none"
                onClick={props.onDismiss}
                icon={<XIcon />}
                size="5"
                color="none"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
