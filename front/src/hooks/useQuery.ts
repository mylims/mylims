import { useHistory, useLocation } from 'react-router-dom';

import { FilesSortField, FileStatus, SortDirection } from '@generated/graphql';

interface FilterQuery {
  page?: string;
  minSize: string;
  maxSize: string;
  minDate: string;
  maxDate: string;
  status: FileStatus[];
  sortField: FilesSortField;
  sortDirection: SortDirection;
}

export function useQuery() {
  let query: Record<string, string | undefined> = {};
  for (const [key, value] of new URLSearchParams(useLocation().search)) {
    query[key] = value;
  }
  return query;
}

export function useSetQuery(base: string) {
  const router = useHistory();
  const search = new URLSearchParams(useLocation().search);
  return (key: keyof FilterQuery, value: string) => {
    search.set(key, value);
    router.replace(`${base}?${search.toString()}`);
  };
}

export function useFilterQuery(
  base: string,
): [FilterQuery, (key: keyof FilterQuery, value: string) => void] {
  const setQuery = useSetQuery(base);
  const {
    page,
    minSize = '0',
    maxSize = '1000000000',
    minDate = new Date(0).toISOString(),
    maxDate = new Date().toISOString(),
    status = FileStatus.IMPORTED,
    sortField = FilesSortField.DATE,
    sortDirection = SortDirection.DESC,
  } = useQuery();
  const statusList: FileStatus[] = status
    .split(',')
    .map((s) => s.trim() as FileStatus);

  return [
    {
      page,
      minSize,
      maxSize,
      minDate,
      maxDate,
      status: statusList,
      sortField: sortField as FilesSortField,
      sortDirection: sortDirection as SortDirection,
    },
    setQuery,
  ];
}
