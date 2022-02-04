import clsx from 'clsx';
import React, { ReactNode, Children, ReactElement } from 'react';

import { Color } from '../types';

export interface FeedItemProps {
  title: ReactNode;
  description?: ReactNode;
  icon: ReactNode;
  iconBackgroundColor?: Color;
}

const colors = {
  [Color.neutral]: 'bg-neutral-400',
  [Color.alternative]: 'bg-alternative-500',
  [Color.danger]: 'bg-danger-500',
  [Color.primary]: 'bg-primary-500',
  [Color.success]: 'bg-success-500',
  [Color.warning]: 'bg-warning-500',
};

export interface FeedProps {
  children: Array<ReactElement<FeedItemProps>>;
  className?: string;
}

export function Feed(props: FeedProps) {
  const length = Children.count(props.children);
  if (length === 0) return null;

  return (
    <div className={clsx('flow-root', props.className)}>
      <ul className="-mb-8">
        {Children.map(props.children, (child, index) => {
          return (
            <li>
              <div className="relative pb-8">
                {index !== props.children.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200"
                    aria-hidden="true"
                  />
                )}

                {child}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Feed.Item = function FeedItem(props: FeedItemProps) {
  const {
    description,
    icon,
    title,
    iconBackgroundColor = Color.neutral,
  } = props;

  return (
    <div className="relative flex space-x-3">
      <div>
        <span
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-full text-white ring-8 ring-white',
            colors[iconBackgroundColor],
          )}
        >
          <span className="h-5 w-5">{icon}</span>
        </span>
      </div>
      <div className="flex min-w-0 flex-1 justify-between space-x-4">
        <div className="min-w-0 flex-1 py-1">
          <div>{title}</div>

          <div className="mt-2 text-sm text-neutral-700">{description}</div>
        </div>
      </div>
    </div>
  );
};
