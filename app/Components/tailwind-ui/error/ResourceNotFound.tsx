import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { SvgOutlineDocumentSearch } from '../svg/heroicon/outline';

interface ResourceNotFoundProps {
  resource: ReactNode;
  className?: string;
  description?: ReactNode;
}

export function ResourceNotFound(props: ResourceNotFoundProps) {
  const { resource, description } = props;
  return (
    <div
      className={clsx(
        'flex flex-col items-center max-w-sm text-center',
        props.className,
      )}
    >
      <SvgOutlineDocumentSearch className="w-12 h-12 text-primary-600" />
      <div className="mt-1 font-medium">{resource}</div>
      <div className="mt-2 text-sm text-neutral-700">
        {description
          ? description
          : 'The resource is missing or you do not have enough permissions to view it.'}
      </div>
    </div>
  );
}
