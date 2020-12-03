import React, { ReactNode } from 'react';

import { SvgOutlineChevronRight } from '../svg/heroicon/outline';

export interface BreadcrumbProps {
  children: Array<ReactNode>;
}

export function Breadcrumb(props: BreadcrumbProps) {
  return (
    <nav className="flex">
      <ol className="flex items-center space-x-4">
        {props.children.map((option, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>
              <div className="flex items-center space-x-4">
                {index !== props.children.length && index !== 0 && (
                  <SvgOutlineChevronRight className="flex-shrink-0 w-5 h-5 text-neutral-400" />
                )}
                {option}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.Item = function (props: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium transition duration-150 ease-in-out text-neutral-500 hover:text-neutral-700">
      {props.children}
    </div>
  );
};

Breadcrumb.Icon = function (props: { children: ReactNode }) {
  return (
    <div className="w-5 h-5 text-neutral-400 hover:text-neutral-500">
      {props.children}
    </div>
  );
};
