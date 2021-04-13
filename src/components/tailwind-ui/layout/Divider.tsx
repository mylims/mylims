import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface DividerProps {
  justify?: 'start' | 'center' | 'end';
  children?: Array<ReactNode> | ReactNode;
}

export interface DividerContent {
  title?: boolean;
  attached?: boolean;

  children?: ReactNode;
}

const pos = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

export function Divider(props: DividerProps) {
  const { children, justify = 'center' } = props;

  if (!children) {
    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-300" />
        </div>
      </div>
    );
  }

  const position =
    Array.isArray(children) && children.length === 2
      ? 'justify-between'
      : pos[justify];

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-neutral-300" />
      </div>
      <div className={clsx('relative flex', position)}>{children}</div>
    </div>
  );
}

Divider.Content = function (props: DividerContent) {
  const { children, title, attached } = props;

  return (
    <span
      className={clsx(
        'bg-white ',
        title
          ? 'text-lg font-semibold text-neutral-900'
          : 'text-sm text-neutral-500',
        {
          'px-3': !attached && title,
          'px-2': !attached && !title,
        },
      )}
    >
      {children}
    </span>
  );
};
