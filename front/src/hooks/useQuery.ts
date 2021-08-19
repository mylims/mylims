import { useHistory, useLocation } from 'react-router-dom';

import { FilesSortField, FileStatus, SortDirection } from '@generated/graphql';

interface FilterQuery {
  page: string;
  minSize: number;
  maxSize: number;
  minDate: Date;
  maxDate: Date;
  status: Record<'value' | 'label', FileStatus>[];
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
  return (newQuery: Partial<FilterQuery>) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value !== undefined) {
        if (typeof value === 'string') {
          search.set(key, value);
        } else if (typeof value === 'number') {
          search.set(key, value.toString());
        } else if (key === 'status') {
          const status = (value as FilterQuery['status'])
            .map((s) => s.value)
            .join(',');
          search.set(key, status);
        } else {
          search.set(key, (value as Date).toISOString());
        }
      }
    }
    router.replace(`${base}?${search.toString()}`);
  };
}

export function useFilterQuery(
  base: string,
): [Partial<FilterQuery>, (newQuery: Partial<FilterQuery>) => void] {
  const setQuery = useSetQuery(base);
  const query = useQuery();
  const statusList = query.status?.split(',').map((s) => {
    const value = s.trim() as FileStatus;
    return { value, label: value };
  }) ?? [{ value: FileStatus.IMPORTED, label: FileStatus.IMPORTED }];
  const minSize = query.minSize ? parseInt(query.minSize, 10) : undefined;
  const maxSize = query.maxSize ? parseInt(query.maxSize, 10) : undefined;
  const minDate = query.minDate ? new Date(query.minDate) : undefined;
  const maxDate = query.maxDate ? new Date(query.maxDate) : undefined;

  return [
    {
      ...query,
      status: statusList,
      minSize,
      maxSize,
      minDate,
      maxDate,
    },
    setQuery,
  ];
}
