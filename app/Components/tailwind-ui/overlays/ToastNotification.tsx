import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React from 'react';

import { NotificationState } from './NotificationContext';

export interface ToastNotificationProps
  extends Omit<
    NotificationState,
    'title' | 'content' | 'icon' | 'isToast' | 'type'
  > {
  label: string;
  onDismiss: () => void;
  action?: {
    label: string;
    handle: () => void;
  };
  position: 'top' | 'bottom';
}

export function ToastNotification(props: ToastNotificationProps) {
  return (
    <Transition
      appear
      show={props.state === 'SHOWING'}
      enter="transition ease-out duration-300"
      enterFrom={clsx(
        props.position === 'bottom' ? 'translate-y-16' : '-translate-y-16',
        'opacity-0',
      )}
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 translate-y-16"
      className="pointer-events-auto w-full bg-neutral-700 sm:max-w-sm sm:rounded-lg sm:ring-1 sm:ring-black sm:ring-opacity-5"
    >
      <div className="z-40 overflow-hidden">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="ml-3 pt-0.5 text-white">{props.label}</div>

            <div className="ml-4 flex items-center">
              {props.action && (
                <button
                  type="button"
                  onClick={props.action.handle}
                  className="mr-2 rounded-md border border-transparent bg-neutral-700 p-1.5 font-semibold text-primary-300 shadow-sm ring-white hover:bg-neutral-100 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-neutral-50 focus:ring-offset-2 focus:ring-offset-neutral-700 active:bg-neutral-50"
                >
                  {props.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={props.onDismiss}
                className="rounded-full bg-neutral-700 p-1.5 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-700 active:bg-neutral-50"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
