import { XIcon } from '@heroicons/react/outline';
import React, { ReactNode } from 'react';

import { PropsOf } from '../../types';

export interface BannerProps<T extends React.ElementType> {
  description: ReactNode;
  linkAs?: T;
  linkAsProps?: PropsOf<T>;
  linkText: string;
  onDismiss?: () => void;
  icon: ReactNode;
}

export function Banner<T extends React.ElementType = 'a'>(
  props: BannerProps<T>,
) {
  const {
    linkAs,
    linkAsProps,
    linkText: buttonText,
    onDismiss,
    description,
    icon,
  } = props;
  const Component: React.ElementType = linkAs || 'a';

  return (
    <div className="bg-primary-700">
      <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-start flex-1 w-0 text-white md:items-center">
            <span className="flex p-2 rounded-lg bg-primary-800">
              <span className="w-6 h-6">{icon}</span>
            </span>
            <div className="ml-3 font-semibold">
              <span className="md:inline">{description}</span>
            </div>
          </div>
          <div className="flex-shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto">
            <Component
              {...linkAsProps}
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold bg-white border border-transparent rounded-md shadow-sm text-primary-600 hover:bg-primary-50"
            >
              {buttonText}
            </Component>
          </div>
          {onDismiss && (
            <div className="flex-shrink-0 order-2 sm:order-3 sm:ml-3">
              <button
                type="button"
                onClick={props.onDismiss}
                className="flex p-2 -mr-1 rounded-md hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
