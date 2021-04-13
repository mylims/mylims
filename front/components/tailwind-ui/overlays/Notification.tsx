import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { SvgOutlineX } from '../svg/heroicon/outline';

import { NotificationState } from './NotificationCenter';

export interface NotificationProps extends NotificationState {
  children: ReactNode;
  className?: string;
  onDismiss: () => void;
}

export function Notification(props: NotificationProps) {
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
      <div className="z-40 overflow-hidden rounded-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-xl">{props.icon}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {props.title && (
                <p className="text-sm font-semibold text-neutral-900">
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
                <SvgOutlineX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
