import clsx from 'clsx';
import React, {
  ComponentType,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

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
}

export function Table<T extends { id: number | string }>(props: TableProps<T>) {
  const {
    data,
    Tr,
    Empty,
    Header,
    pagination,
    tableStyle,
    tableClassName,
  } = props;

  if (data.length === 0) {
    return Empty ? <Empty /> : null;
  }

  return (
    <div className="flex flex-col">
      <div>
        <div className="inline-block min-w-full overflow-hidden align-middle border-b shadow border-neutral-200 sm:rounded-lg">
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
  );
}

export interface TdProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  compact?: boolean;
}

export interface ThProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  compact?: boolean;
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
  const { compact, className, ...otherProps } = props;
  return (
    <th
      className={clsx(
        'text-xs font-semibold tracking-wider text-left uppercase text-neutral-500 bg-neutral-50',
        {
          'px-6 py-3': !compact,
        },
        className,
      )}
      {...otherProps}
    />
  );
}
