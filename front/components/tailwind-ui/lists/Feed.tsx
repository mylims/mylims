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
  if (props.children.length === 0) return null;

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

Feed.Item = function (props: FeedItemProps) {
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
            'flex items-center justify-center w-8 h-8 text-white rounded-full ring-8 ring-white',
            colors[iconBackgroundColor],
          )}
        >
          {icon}
        </span>
      </div>
      <div className="flex justify-between flex-1 min-w-0 space-x-4">
        <div className="flex-1 min-w-0 py-1">
          <div>{title}</div>

          <div className="mt-2 text-sm text-gray-700">{description}</div>
        </div>
      </div>
    </div>
  );
};
