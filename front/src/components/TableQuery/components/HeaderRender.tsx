import { Popover } from '@headlessui/react';
import { DocumentSearchIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, {
  ForwardedRef,
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';

import SortIcon from './SortIcon';

interface HeaderRenderProps {
  title: string;
  path: string;
  disableSort?: boolean;
  children?: (
    ref: ForwardedRef<HTMLInputElement>,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  if (!children) return <th className={titleClassName}>{title}</th>;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, query]);
  const Child = forwardRef<HTMLInputElement>((_, ref) => children(ref));
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
              onClick={() => setIsOpen(!isOpen)}
            />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 p-2 bg-white rounded-lg shadow">
            <Child ref={inputRef} />
          </Popover.Panel>
        </Popover>
        <SortIcon disableSort={!!disableSort} path={path} />
      </div>
    </th>
  );
}
