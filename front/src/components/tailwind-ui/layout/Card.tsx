import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface CardProps {
  mobileEdgeToEdge?: boolean;
  children: ReactNode;
}

export function Card({ mobileEdgeToEdge, children }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white overflow-hidden shadow',
        mobileEdgeToEdge ? 'sm:rounded-lg' : 'rounded-lg',
      )}
    >
      {children}
    </div>
  );
}

interface CardElementProps {
  grayBackground?: boolean;
  children: ReactNode;
}

Card.Header = function CardHeader({
  grayBackground = false,
  children,
}: CardElementProps) {
  return (
    <div
      className={clsx(
        'px-4 py-5 sm:px-6',
        grayBackground ? 'bg-neutral-50' : 'border-b border-neutral-200',
      )}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({
  grayBackground = false,
  children,
}: CardElementProps) {
  return (
    <div
      className={clsx('px-4 py-5 sm:p-6', grayBackground && 'bg-neutral-50')}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  grayBackground = false,
  children,
}: CardElementProps) {
  return (
    <div
      className={clsx(
        'px-4 py-4 sm:px-6',
        grayBackground ? 'bg-neutral-50' : 'border-t border-neutral-200',
      )}
    >
      {children}
    </div>
  );
};
