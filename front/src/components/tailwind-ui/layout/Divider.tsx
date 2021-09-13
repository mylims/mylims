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

  const isBoth = Array.isArray(children) && children.length === 2;
  if (justify === 'center' && !isBoth) {
    return <DividerCenter>{children}</DividerCenter>;
  }

  if (justify !== 'center' && !isBoth) {
    return <DividerSide side={justify}>{children}</DividerSide>;
  }

  return isBoth ? (
    <DividerSide side="both">{children}</DividerSide>
  ) : (
    <DividerCenter>{children}</DividerCenter>
  );
}

Divider.Content = function DividerContent(props: DividerContent) {
  const { children, title, attached } = props;

  return (
    <span
      className={clsx(
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

export function DividerCenter(props: { children: ReactNode }) {
  return (
    <div className="flex">
      <div className="flex items-center flex-1">
        <div className="w-full border-t border-neutral-300" />
      </div>
      <div className="flex">{props.children}</div>
      <div className="flex items-center flex-1">
        <div className="w-full border-t border-neutral-300" />
      </div>
    </div>
  );
}

export function DividerSide(props: {
  children: Array<ReactNode> | ReactNode;
  side?: 'start' | 'end' | 'both';
}) {
  const { side = 'start', children } = props;

  if (side === 'both' && Array.isArray(children)) {
    return (
      <div className="flex">
        <div className="flex">{children[0]}</div>
        <div className="flex items-center flex-1">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="flex">{children[1]}</div>
      </div>
    );
  }

  return (
    <div className={clsx('flex', side === 'end' ? 'flex-row-reverse' : '')}>
      <div className="flex">{children}</div>
      <div className="flex items-center flex-1">
        <div className="w-full border-t border-neutral-300" />
      </div>
    </div>
  );
}
