import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface ListContainerProps {
  mobileEdgeToEdge?: boolean;
  children: ReactNode;
}

export interface ListContainerItemProps {
  children: ReactNode;
  className?: string;
}

export function SimpleListContainer(
  props: Omit<ListContainerProps, 'mobileEdgeToEdge'>,
) {
  return <ul className="divide-y divide-neutral-200">{props.children}</ul>;
}

export function CardListContainer(props: ListContainerProps) {
  const { mobileEdgeToEdge } = props;

  return (
    <div
      className={clsx(
        'overflow-hidden bg-white shadow',
        mobileEdgeToEdge ? 'sm:rounded-md' : 'rounded-md',
      )}
    >
      <ul className="divide-y divide-neutral-200">{props.children}</ul>
    </div>
  );
}

export function FlatCardListContainer(props: ListContainerProps) {
  const { mobileEdgeToEdge } = props;

  return (
    <div
      className={clsx(
        'overflow-hidden border border-neutral-300  bg-white',
        mobileEdgeToEdge ? 'sm:rounded-md' : 'rounded-md',
      )}
    >
      <ul className="divide-y divide-neutral-300">{props.children}</ul>
    </div>
  );
}

SimpleListContainer.Item = function SimpleListContainerItem(
  props: ListContainerItemProps,
) {
  return <li className={clsx('py-4', props.className)}>{props.children}</li>;
};

CardListContainer.Item = function CardListContainerItem(
  props: ListContainerItemProps,
) {
  return <SimpleListContainer.Item {...props} />;
};

FlatCardListContainer.Item = function FlatCardListContainerItem(
  props: Omit<ListContainerItemProps, 'mobileEdgeToEdge'>,
) {
  return (
    <li className={clsx('px-6 py-4', props.className)}>{props.children}</li>
  );
};
