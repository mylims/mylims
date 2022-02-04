import { ChevronRightIcon } from '@heroicons/react/outline';
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
} from 'react';

const BreadcrumbContext = createContext<boolean | null>(null);

export interface BreadcrumbProps {
  children: Array<ReactElement>;
}

interface BreadcrumbContentProps {
  children: ReactNode;
}

export function Breadcrumb(props: BreadcrumbProps) {
  const Child = React.Children.map(props.children, (child, index) => {
    return (
      <BreadcrumbContext.Provider value={index === 0}>
        <div className="flex items-center space-x-4">{child}</div>
      </BreadcrumbContext.Provider>
    );
  });

  return (
    <nav className="flex">
      <ol className="flex items-center space-x-4">{Child}</ol>
    </nav>
  );
}

Breadcrumb.Group = function BreadcrumbGroup(props: BreadcrumbProps) {
  const Child = React.Children.map(props.children, (child, index) => {
    return (
      <BreadcrumbContext.Provider value={index === 0}>
        <div className="flex items-center space-x-4">{child}</div>
      </BreadcrumbContext.Provider>
    );
  });

  return (
    <BreadcrumbContentWrapper>
      <nav className="flex">
        <ol className="flex items-center space-x-4">{Child}</ol>
      </nav>
    </BreadcrumbContentWrapper>
  );
};

Breadcrumb.Item = function BreadcrumbItem(props: BreadcrumbContentProps) {
  return (
    <BreadcrumbContentWrapper>
      <div className="text-sm font-semibold text-neutral-500 transition duration-150 ease-in-out hover:text-neutral-700">
        {props.children}
      </div>
    </BreadcrumbContentWrapper>
  );
};

Breadcrumb.Icon = function BreadcrumbIcon(props: BreadcrumbContentProps) {
  return (
    <BreadcrumbContentWrapper>
      <div className="h-5 w-5 text-neutral-400 hover:text-neutral-500">
        {props.children}
      </div>
    </BreadcrumbContentWrapper>
  );
};

function BreadcrumbContentWrapper(props: BreadcrumbContentProps) {
  const context = useContext(BreadcrumbContext);

  if (context === null) {
    throw new Error('Cannot use this component outside a Breadcrumb');
  }

  return (
    <>
      {context === false && (
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-neutral-400" />
      )}
      {props.children}
    </>
  );
}
