import { ChevronRightIcon } from '@heroicons/react/outline';
import React, { ReactNode } from 'react';

import { PropsOf } from '../types';

export interface StackedListProps {
  children: ReactNode;
}

export function StackedList(props: StackedListProps) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul>{props.children}</ul>
    </div>
  );
}

type StackedListRowProps<T> = {
  as?: T;
  children: [ReactNode, ReactNode];
} & PropsOf<T>;

StackedList.Row = function <
  T extends React.ElementType = typeof React.Fragment,
>(props: StackedListRowProps<T>) {
  const { as: Element = React.Fragment, children, ...otherProps } = props;

  return (
    <li className="block transition duration-150 ease-in-out hover:bg-neutral-50 focus:outline-none focus:bg-neutral-50">
      <Element {...otherProps}>
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
              {children}
            </div>
          </div>
          <div>
            <ChevronRightIcon className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </Element>
    </li>
  );
};
