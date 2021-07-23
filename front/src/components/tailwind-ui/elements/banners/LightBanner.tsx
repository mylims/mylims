import { XIcon } from '@heroicons/react/outline';
import React, { ReactNode } from 'react';

export interface LightBannerProps {
  description: ReactNode;
  renderButton: () => ReactNode;
  onDismiss?: () => void;
}

export function LightBanner(props: LightBannerProps) {
  const { description, renderButton } = props;
  return (
    <div className="relative bg-primary-700">
      <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <div className="font-semibold text-white">
            <span className="md:hidden">{description}</span>
            <span className="hidden md:inline">{description}</span>
            <span className="block sm:ml-2 sm:inline-block">
              {renderButton?.()}
            </span>
          </div>
        </div>
        {props.onDismiss && (
          <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
            <button
              type="button"
              onClick={props.onDismiss}
              className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
