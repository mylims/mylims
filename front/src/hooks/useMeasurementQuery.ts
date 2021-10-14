import { useHistory, useLocation } from 'react-router-dom';

import { useQuery } from './useQuery';

import { MeasurementSortField, SortDirection } from '@/generated/graphql';

type Nullable<T> = { [P in keyof T]: T[P] | null };
interface FilterQuery {
  page: string;
  type: string;
  username: string;
  sampleCode: string[];
  createdBy: string;
  sortField: { value: MeasurementSortField; label: string };
  sortDirection: { value: SortDirection; label: string };
}

export const selectOrder = {
  [SortDirection.ASC]: 'Ascend',
  [SortDirection.DESC]: 'Descend',
};
export const selectField = {
  [MeasurementSortField.CREATEDAT]: 'Creation date',
  [MeasurementSortField.CREATEDBY]: 'Created by',
  [MeasurementSortField.USERNAME]: 'Username',
};
export type MeasurementQueryType = Nullable<FilterQuery>;
export function useSetMeasurementQuery() {
  const router = useHistory();
  const search = new URLSearchParams(useLocation().search);
  return (newQuery: MeasurementQueryType) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value !== null) {
        switch (key) {
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
            search.set(key, value as string);
          }
        }
      }
    }
    router.replace(`?${search.toString()}`);
  };
}

export function useFilterMeasurementQuery(): [
  MeasurementQueryType,
  (newQuery: MeasurementQueryType) => void,
] {
  const setQuery = useSetMeasurementQuery();
  const query = useQuery();
  const sampleCode = query.sampleCode?.split(',') ?? null;
  const sortField =
    (query.sortField as MeasurementSortField) || MeasurementSortField.CREATEDAT;
  const sortDirection =
    (query.sortDirection as SortDirection) || SortDirection.DESC;

  return [
    {
      page: query.page ?? null,
      type: query.type ?? null,
      username: query.username ?? null,
      sampleCode,
      createdBy: query.createdBy ?? null,
      sortField: { value: sortField, label: selectField[sortField] },
      sortDirection: {
        value: sortDirection,
        label: selectOrder[sortDirection],
      },
    },
    setQuery,
  ];
}
