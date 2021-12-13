import bytes from 'byte-size';
import { useNavigate } from 'react-router-dom';

import { useQuery } from './useQuery';

import { FilesSortField, FileStatus, SortDirection } from '@/generated/graphql';
import filesizeParser from '@/utils/filesize-parser';

type Nullable<T> = { [P in keyof T]: T[P] | null };
interface FilterQuery {
  page: string;
  filename: string;
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
export function useSetFilesQuery() {
  const navigate = useNavigate();
  const search = new URLSearchParams();
  return (newQuery: Nullable<FilterQuery>) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value) {
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
          case 'page':
          case 'filename': {
            search.set(key, value as FilterQuery['page' | 'filename']);
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
    navigate(`?${search.toString()}`, { replace: true });
  };
}

export function useFilterFilesQuery(): [
  Nullable<FilterQuery>,
  (newQuery: Nullable<FilterQuery>) => void,
] {
  const setQuery = useSetFilesQuery();
  const query = useQuery();
  const statusList =
    query.status
      ?.split(',')
      .filter((s) => !!s)
      .map((s) => {
        const value = s.trim() as FileStatus;
        return { value, label: value };
      }) ?? [];
  const minSize = query.minSize ? bytes(query.minSize).toString() : '';
  const maxSize = query.maxSize ? bytes(query.maxSize).toString() : '';
  const minDate = query.minDate ? new Date(query.minDate) : null;
  const maxDate = query.maxDate ? new Date(query.maxDate) : null;
  const sortField =
    (query.sortField as FilesSortField) || FilesSortField.CREATIONDATE;
  const sortDirection =
    (query.sortDirection as SortDirection) || SortDirection.DESC;

  return [
    {
      page: query.page ?? null,
      filename: query.filename ?? '',
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
