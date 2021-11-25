import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { Color } from '..';

import { NotificationState } from './NotificationContext';

export interface NotificationProps extends Omit<NotificationState, 'content'> {
  children: ReactNode;
  className?: string;
  onDismiss: () => void;
}

export function Notification(props: NotificationProps) {
  const { type = Color.neutral } = props;

  return (
    <Transition
      appear
      show={props.state === 'SHOWING'}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={clsx(
        'w-full max-w-sm bg-white rounded-lg shadow-lg pointer-events-auto',
        props.className,
      )}
    >
      <div
        className={clsx(
          'z-40 overflow-hidden rounded-lg ring-1 ring-black ring-opacity-5',
          {
            'border border-danger-500': type === Color.danger,
            'border border-warning-500': type === Color.warning,
            'border border-success-500': type === Color.success,
            'border border-alternative-500': type === Color.alternative,
            'border border-primary-500': type === Color.primary,
          },
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 text-xl text-neutral-600">
              {props.icon}
            </div>
            <div
              className={clsx('ml-3 w-0 flex-1 pt-0.5', {
                'text-danger-500': type === Color.danger,
                'text-warning-500': type === Color.warning,
                'text-success-500': type === Color.success,
                'text-alternative-500': type === Color.alternative,
                'text-primary-500': type === Color.primary,
              })}
            >
              {props.title && (
                <p
                  className={clsx('text-sm font-semibold', {
                    'text-danger-800': type === Color.danger,
                    'text-warning-800': type === Color.warning,
                    'text-success-800': type === Color.success,
                    'text-alternative-800': type === Color.alternative,
                    'text-primary-800': type === Color.primary,
                  })}
                >
                  {props.title}
                </p>
              )}

              {props.children}
            </div>
            <div className="flex flex-shrink-0 ml-4">
              <button
                type="button"
                onClick={props.onDismiss}
                className="inline-flex transition duration-150 ease-in-out text-neutral-400 focus:outline-none focus:text-neutral-500"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
