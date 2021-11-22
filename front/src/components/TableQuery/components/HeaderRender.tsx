import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { DocumentSearchIcon } from '@heroicons/react/outline';

import { Popover } from '@headlessui/react';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import SortIcon from './SortIcon';

interface HeaderRenderProps {
  title: string;
  path: string;
  disableSort?: boolean;
  children?: ReactNode;
}

const titleClassName =
  'px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase rounded-t-lg text-neutral-500 flex';
export default function HeaderRender({
  title,
  path,
  disableSort,
  children,
}: HeaderRenderProps) {
  const { query } = useTableQueryContext();
  if (!children) return <th className={titleClassName}>{title}</th>;

  return (
    <th>
      <div className={titleClassName}>
        <span>{title}</span>
        <Popover className="relative">
          <Popover.Button aria-label={`Filter by ${title}`}>
            <DocumentSearchIcon
              className={clsx(
                'w-5 h-5 flex-none',
                query[path] ? 'text-primary-600' : 'text-neutral-400',
              )}
            />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 p-2 bg-white rounded-lg shadow">
            {children}
          </Popover.Panel>
        </Popover>
        <SortIcon disableSort={!!disableSort} path={path} />
      </div>
    </th>
  );
}
