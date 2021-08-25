import bytes from 'byte-size';
import { useHistory, useLocation } from 'react-router-dom';

import { FilesSortField, FileStatus, SortDirection } from '@generated/graphql';
import filesizeParser from '@utils/filesize-parser';

type Nullable<T> = { [P in keyof T]: T[P] | null };
interface FilterQuery {
  page: string;
  minSize: string;
  maxSize: string;
  minDate: Date;
  maxDate: Date;
  status: Record<'value' | 'label', FileStatus>[];
  sortField: { value: FilesSortField; label: string };
  sortDirection: { value: SortDirection; label: string };
}

export const selectOrder = {
  [SortDirection.ASC]: 'Ascend',
  [SortDirection.DESC]: 'Descend',
};
export const selectField = {
  [FilesSortField.CREATIONDATE]: 'Creation date',
  [FilesSortField.DATE]: 'Date',
  [FilesSortField.FILENAME]: 'Filename',
  [FilesSortField.MODIFICATIONDATE]: 'Modification date',
  [FilesSortField.SIZE]: 'Size',
};
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
  return (newQuery: Nullable<FilterQuery>) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value !== null) {
        switch (key) {
          case 'minSize':
          case 'maxSize': {
            const size = filesizeParser(
              value as FilterQuery['minSize' | 'maxSize'],
            );
            search.set(key, size.toString());
            break;
          }
          case 'minDate':
          case 'maxDate': {
            search.set(
              key,
              (value as FilterQuery['minDate' | 'maxDate']).toISOString(),
            );
            break;
          }
          case 'status': {
            const status = (value as FilterQuery['status'])
              .map((s) => s.value)
              .join(',');
            search.set(key, status);
            break;
          }
          case 'page': {
            search.set(key, value as FilterQuery['page']);
            break;
          }
          case 'sortField':
          case 'sortDirection': {
            search.set(
              key,
              (value as FilterQuery['sortField' | 'sortDirection']).value,
            );
            break;
          }
          default: {
            throw new Error(`Unknown key: ${key}`);
          }
        }
      }
    }
    router.replace(`${base}?${search.toString()}`);
  };
}

export function useFilterQuery(
  base: string,
): [Nullable<FilterQuery>, (newQuery: Nullable<FilterQuery>) => void] {
  const setQuery = useSetQuery(base);
  const query = useQuery();
  const statusList = query.status?.split(',').map((s) => {
    const value = s.trim() as FileStatus;
    return { value, label: value };
  }) ?? [{ value: FileStatus.IMPORTED, label: FileStatus.IMPORTED }];
  const minSize = query.minSize ? bytes(query.minSize).toString() : null;
  const maxSize = query.maxSize ? bytes(query.maxSize).toString() : null;
  const minDate = query.minDate ? new Date(query.minDate) : null;
  const maxDate = query.maxDate ? new Date(query.maxDate) : null;
  const sortField =
    (query.sortField as FilesSortField) || FilesSortField.CREATIONDATE;
  const sortDirection =
    (query.sortDirection as SortDirection) || SortDirection.DESC;

  return [
    {
      page: query.page ?? null,
      status: statusList,
      minSize,
      maxSize,
      minDate,
      maxDate,
      sortField: { value: sortField, label: selectField[sortField] },
      sortDirection: {
        value: sortDirection,
        label: selectOrder[sortDirection],
      },
    },
    setQuery,
  ];
}
