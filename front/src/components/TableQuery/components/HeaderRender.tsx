import { Popover } from '@headlessui/react';
import { DocumentSearchIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { usePopper } from 'react-popper';

import { useTableQueryContext } from '../hooks/useTableQueryContext';

import SortIcon from './SortIcon';

interface HeaderRenderProps {
  title: string;
  path: string;
  width?: number;
  queryIndex?: number;
  disableSort?: boolean;
  children?: ReactElement<void, string | JSXElementConstructor<void>>;
}

const TITLE_CLASS =
  'px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase rounded-t-lg text-neutral-500 flex';
export default function HeaderRender({
  title,
  path,
  width,
  queryIndex,
  disableSort,
  children,
}: HeaderRenderProps) {
  const { query } = useTableQueryContext();
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  if (!children) {
    return (
      <th style={{ width }}>
        <div className={TITLE_CLASS}>
          <span>{title}</span>
          <SortIcon disableSort={!!disableSort} path={path} />
        </div>
      </th>
    );
  }
  const filtered = Object.keys(query).some((key) =>
    key.startsWith(queryIndex === undefined ? path : `${path}.${queryIndex}`),
  );

  return (
    <th style={{ width }}>
      <div className={TITLE_CLASS}>
        <span>{title}</span>
        <Popover className="relative">
          <Popover.Button
            aria-label={`Filter by ${title}`}
            ref={setReferenceElement}
          >
            <DocumentSearchIcon
              className={clsx(
                'h-5 w-5 flex-none',
                filtered ? 'text-primary-600' : 'text-neutral-400',
              )}
            />
          </Popover.Button>

          <Popover.Panel
            className="absolute z-10 rounded-lg bg-white p-2 shadow"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {children}
          </Popover.Panel>
        </Popover>
        <SortIcon disableSort={!!disableSort} path={path} />
      </div>
    </th>
  );
}
