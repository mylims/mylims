import {
  SortAscendingIcon,
  SortDescendingIcon,
  MenuAlt4Icon,
} from '@heroicons/react/solid';
import clsx from 'clsx';
import React, {
  ComponentType,
  createContext,
  TdHTMLAttributes,
  ThHTMLAttributes,
  useContext,
  useMemo,
} from 'react';

import { TableSortDirection, TableSortConfig } from '..';
import { Pagination, PaginationProps } from '../elements/pagination/Pagination';

export interface TrProps<T> {
  index: number;
  value: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableProps<T = any> {
  data: Array<T>;
  Tr: ComponentType<TrProps<T>>;
  Empty?: ComponentType;
  Header?: ComponentType;
  pagination?: PaginationProps;
  itemsPerPage?: number;
  tableStyle?: React.CSSProperties;
  tableClassName?: string;
  sort?: TableSortConfig;
}

interface TableContext {
  sort?: TableSortConfig;
}

const defaultTableContext: TableContext = {};

const tableContext = createContext<TableContext>(defaultTableContext);

export function Table<T extends { id: number | string }>(props: TableProps<T>) {
  const {
    data,
    Tr,
    Empty,
    Header,
    pagination,
    tableStyle,
    tableClassName,
    sort,
  } = props;

  const contextValue = useMemo(() => ({ sort }), [sort]);

  if (data.length === 0) {
    return Empty ? <Empty /> : null;
  }

  return (
    <tableContext.Provider value={contextValue}>
      <div className="flex flex-col">
        <div>
          <div className="inline-block min-w-full align-middle border-b shadow border-neutral-200 sm:rounded-lg">
            <table
              style={tableStyle}
              className={clsx(
                'min-w-full divide-y divide-neutral-200',
                tableClassName,
              )}
            >
              {Header && (
                <thead>
                  <Header />
                </thead>
              )}
              <tbody className="bg-white divide-y divide-neutral-200">
                {data.map((value, index) => (
                  <Tr key={value.id} index={index} value={value} />
                ))}
              </tbody>
            </table>
            {pagination && (
              <div>
                <Pagination {...pagination} />
              </div>
            )}
          </div>
        </div>
      </div>
    </tableContext.Provider>
  );
}

export interface TdProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  compact?: boolean;
}

export interface ThProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  compact?: boolean;
  sortField?: string;
}

export function Td(props: TdProps) {
  const { className, compact, ...otherProps } = props;
  return (
    <td
      className={clsx(
        'text-sm font-semibold whitespace-nowrap text-neutral-900',
        { 'px-6 py-4': !compact },
        props.className,
      )}
      {...otherProps}
    />
  );
}

export function Th(props: ThProps) {
  const { compact, sortField, className, children, ...otherProps } = props;
  const { sort } = useContext(tableContext);

  let handleClick, sortedClass, sortElement;
  if (sortField && sort) {
    handleClick = () => sort.onChange(sortField);
    sortedClass = 'cursor-pointer';
    if (sortField === sort.field) {
      sortElement =
        sort.direction === TableSortDirection.ASCENDING ? (
          <SortAscendingIcon className="w-4 h-4" />
        ) : (
          <SortDescendingIcon className="w-4 h-4" />
        );
    } else {
      sortElement = <MenuAlt4Icon className="w-4 h-4" />;
    }
  }

  return (
    <th
      className={clsx(
        'text-xs font-semibold tracking-wider text-left uppercase text-neutral-500 bg-neutral-50',
        {
          'px-6 py-3': !compact,
        },
        className,
        sortedClass,
      )}
      onClick={handleClick}
      {...otherProps}
    >
      <div className="flex gap-x-1">
        {children}
        {sortElement}
      </div>
    </th>
  );
}
