import React, { ReactNode } from 'react';

import { SvgOutlineX } from '../../svg/heroicon/outline';

export interface LightBannerProps {
  description: ReactNode;
  renderButton: () => ReactNode;
  onDismiss?: () => void;
}

export function LightBanner(props: LightBannerProps) {
  const { description, renderButton } = props;
  return (
    <div className="relative bg-primary-700">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-semibold text-white">
            <span className="md:hidden">{description}</span>
            <span className="hidden md:inline">{description}</span>
            <span className="block sm:ml-2 sm:inline-block">
              {renderButton?.()}
            </span>
          </p>
        </div>
        {props.onDismiss && (
          <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
            <button
              type="button"
              onClick={props.onDismiss}
              className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Dismiss</span>
              <SvgOutlineX className="h-6 w-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
