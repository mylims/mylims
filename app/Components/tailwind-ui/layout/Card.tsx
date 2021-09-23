import clsx from 'clsx';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';

export interface CardProps {
  mobileEdgeToEdge?: boolean;
  children: ReactNode;
}

interface CardContextValue {
  mobileEdgeToEdge?: boolean;
}

const cardContext = createContext<CardContextValue | null>(null);

function useCardContext() {
  const card = useContext(cardContext);
  if (card === null) {
    throw new Error(
      'Card subcomponents should be children of the Card component',
    );
  }
  return card;
}
export function Card({ mobileEdgeToEdge, children }: CardProps) {
  const contextValue = useMemo(() => {
    return { mobileEdgeToEdge };
  }, [mobileEdgeToEdge]);
  return (
    <cardContext.Provider value={contextValue}>
      <div
        className={clsx(
          'bg-white shadow',
          mobileEdgeToEdge ? 'sm:rounded-lg' : 'rounded-lg',
        )}
      >
        {children}
      </div>
    </cardContext.Provider>
  );
}

interface CardElementProps {
  grayBackground?: boolean;
  className?: string;
  children: ReactNode;
}

Card.Header = function CardHeader({
  grayBackground,
  className,
  children,
}: CardElementProps) {
  const { mobileEdgeToEdge } = useCardContext();
  return (
    <div
      className={clsx(
        'px-4 py-5 sm:px-6',
        grayBackground ? 'bg-neutral-50' : 'border-b border-neutral-200',
        mobileEdgeToEdge ? 'sm:rounded-t-lg' : 'rounded-t-lg',
        className,
      )}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({
  className,
  grayBackground = false,
  children,
}: CardElementProps) {
  return (
    <div
      className={clsx(
        'px-4 py-5 sm:p-6',
        grayBackground && 'bg-neutral-50',
        className,
      )}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  grayBackground = false,
  className,
  children,
}: CardElementProps) {
  const { mobileEdgeToEdge } = useCardContext();

  return (
    <div
      className={clsx(
        'px-4 py-4 sm:px-6',
        grayBackground ? 'bg-neutral-50' : 'border-t border-neutral-200',
        mobileEdgeToEdge ? 'sm:rounded-b-lg' : 'rounded-b-lg',

        className,
      )}
    >
      {children}
    </div>
  );
};
