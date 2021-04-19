import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { SvgOutlineX } from '../svg/heroicon/outline';

import { NotificationState } from './NotificationCenter';

export interface NotificationToastProps
  extends Omit<NotificationState, 'title' | 'content' | 'icon' | 'isToast'> {
  label: string;
  onDismiss: () => void;
  action?: {
    label: string;
    handle: () => void;
  };
  position: 'top' | 'bottom';
}

export function ToastNotification(props: NotificationToastProps) {
  return (
    <Transition
      appear
      show={props.state === 'SHOWING'}
      enter="transform ease-out duration-300 transition"
      enterFrom={clsx(
        props.position === 'bottom' ? 'translate-y-16' : '-translate-y-16',
        'opacity-0',
      )}
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 translate-y-16"
      className="w-full pointer-events-auto sm:max-w-sm sm:rounded-lg sm:ring-1 sm:ring-black sm:ring-opacity-5 bg-neutral-700"
    >
      <div className="z-40 overflow-hidden">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="ml-3 pt-0.5 text-white">{props.label}</div>

            <div className="flex items-center ml-4">
              {props.action && (
                <button
                  type="button"
                  onClick={props.action.handle}
                  className="border border-transparent font-semibold mr-2 rounded-md shadow-sm p-1.5 focus:outline-none focus:ring-offset-neutral-700 ring-white focus:ring-2 focus:ring-offset-2 text-primary-300 bg-neutral-700 hover:bg-neutral-100 active:bg-neutral-50 hover:text-primary-800 focus:ring-neutral-50"
                >
                  {props.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={props.onDismiss}
                className="rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-700 text-neutral-300 bg-neutral-700 hover:bg-neutral-100 hover:text-neutral-700 active:bg-neutral-50 focus:ring-neutral-100"
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
