import { useEffect, useReducer } from 'react';

import { PaginationProps } from '../elements/pagination/Pagination';
import type { ActionType } from '../types';
import { assertUnreachable, delve } from '../util';

export interface TableHookOptions {
  initialPage?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
  pagesPerSide?: number;
  withText?: boolean;
  initialSortField?: string;
  initialSortDirection?: TableSortDirection;
}

export interface TableSortConfig {
  field: string | null;
  direction: TableSortDirection;
  onChange: TableSortChangeCallback;
}

export enum TableSortDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export type TableSortChangeCallback = (field: string) => void;

export interface TableHookResult<T> {
  pagination: PaginationProps;
  data: Array<T>;
  sort: TableSortConfig;
}

interface TableState {
  page: number;
  sortField: string | null;
  sortDirection: TableSortDirection;
}

type TableAction =
  | ActionType<'SET_PAGE', number>
  | ActionType<'SET_SORT', string>;

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SET_PAGE': {
      return {
        ...state,
        page: action.payload,
      };
    }
    case 'SET_SORT': {
      const field = action.payload;
      if (state.sortField === field) {
        if (state.sortDirection === TableSortDirection.DESCENDING) {
          return {
            ...state,
            sortField: null,
            sortDirection: TableSortDirection.ASCENDING,
          };
        } else {
          return {
            ...state,
            sortDirection: TableSortDirection.DESCENDING,
          };
        }
      } else {
        return {
          ...state,
          sortField: field,
          sortDirection: TableSortDirection.ASCENDING,
        };
      }
    }
    default:
      assertUnreachable(action);
  }
}

export function useTable<T extends object>(
  data: Array<T>,
  options: TableHookOptions = { itemsPerPage: 10, initialPage: 1 },
): TableHookResult<T> {
  const {
    itemsPerPage = 10,
    initialPage = 1,
    initialSortField = null,
    initialSortDirection = TableSortDirection.ASCENDING,
    maxVisiblePages,
    pagesPerSide,
    withText,
  } = options;

  const [{ page, sortField, sortDirection }, dispatch] = useReducer(
    tableReducer,
    {
      page: initialPage,
      sortField: initialSortField,
      sortDirection: initialSortDirection,
    },
  );

  useEffect(() => {
    // Reset the page when the data length changes.
    dispatch({ type: 'SET_PAGE', payload: initialPage });
  }, [data.length, initialPage]);

  let finalData = data;

  // Apply sort config.
  if (sortField) {
    finalData = sortData(finalData.slice(), sortField, sortDirection);
  }

  // Apply pagination.
  const first = (page - 1) * itemsPerPage;
  const last = first + itemsPerPage;
  finalData = finalData.slice(first, last);

  return {
    data: finalData,
    pagination: {
      centerPagesPerSide: maxVisiblePages,
      boundaryPagesPerSide: pagesPerSide,
      withText,
      page,
      itemsPerPage,
      totalCount: data.length,
      onPageChange(next) {
        dispatch({ type: 'SET_PAGE', payload: next });
      },
    },
    sort: {
      field: sortField,
      direction: sortDirection,
      onChange(field) {
        dispatch({ type: 'SET_SORT', payload: field });
      },
    },
  };
}

type Comparator = (value1: unknown, value2: unknown) => number;

type ComparatorType = 'string' | 'number' | 'boolean' | 'date';

const comparators: Record<ComparatorType, Comparator> = {
  string: (value1, value2) => String(value1).localeCompare(String(value2)),
  number: (value1, value2) => Number(value1) - Number(value2),
  // We already know that value1 is not equal to value2 at this point.
  boolean: (value1) => -Number(value1),
  date: (value1, value2) => Number(value1) - Number(value2),
};

function getComparator(value: unknown) {
  const valueType = typeof value;
  if (
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean'
  ) {
    return comparators[valueType];
  }
  if (valueType === 'object') {
    if (value instanceof Date) {
      return comparators.date;
    }
  }
  throw new TypeError('Unsupported value type to sort');
}

function sortData<DataType extends object>(
  data: DataType[],
  sortField: string,
  sortDirection: TableSortDirection,
): DataType[] {
  const key = sortField.split('.');
  let comparator: Comparator;
  const sorted = data.sort((elem1, elem2) => {
    const value1 = delve(elem1, key);
    const value2 = delve(elem2, key);
    if (value1 === value2) return 0;
    if (value1 === null || value1 === undefined || value1 === '') {
      return 1;
    }
    if (value2 === null || value2 === undefined || value2 === '') {
      return -1;
    }
    if (!comparator) {
      // Assume that fields do not mix types.
      comparator = getComparator(value1);
    }
    return comparator(value1, value2);
  });
  return sortDirection === TableSortDirection.ASCENDING
    ? sorted
    : sorted.reverse();
}
