import { useState } from 'react';

import { PaginationProps } from '../elements/pagination/Pagination';

export interface TableHookOptions {
  initialPage?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
  pagesPerSide?: number;
  withText?: boolean;
}

export interface TableHookResult<T> {
  pagination: PaginationProps;
  data: Array<T>;
}

export function useTable<T>(
  data: Array<T>,
  options: TableHookOptions = { itemsPerPage: 10, initialPage: 1 },
): TableHookResult<T> {
  const { itemsPerPage = 10, initialPage = 1 } = options;

  const [page, setPage] = useState(initialPage);

  const first = (page - 1) * itemsPerPage;
  const last = first + itemsPerPage;

  return {
    data: data.slice(first, last),
    pagination: {
      ...options,
      page,
      itemsPerPage,
      totalCount: data.length,
      onPageChange: (next) => {
        setPage(next);
      },
    },
  };
}
