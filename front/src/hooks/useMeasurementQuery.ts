import { useHistory } from 'react-router-dom';

import { useQuery } from './useQuery';

import {
  MeasurementSortField,
  MeasurementTypes,
  SortDirection,
} from '@/generated/graphql';

type Nullable<T> = { [P in keyof T]: T[P] | null };
interface FilterQuery {
  page: string;
  type: { value: MeasurementTypes; label: string };
  username: string;
  sampleCode: string;
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
  const search = new URLSearchParams();
  return (newQuery: MeasurementQueryType) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value) {
        switch (key) {
          case 'page': {
            search.set(key, value as FilterQuery['page']);
            break;
          }
          case 'type':
          case 'sortField':
          case 'sortDirection': {
            search.set(
              key,
              (value as FilterQuery['sortField' | 'sortDirection' | 'type'])
                .value,
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
  const sortField =
    (query.sortField as MeasurementSortField) || MeasurementSortField.CREATEDAT;
  const sortDirection =
    (query.sortDirection as SortDirection) || SortDirection.DESC;
  const type = query.type as MeasurementTypes;

  return [
    {
      page: query.page ?? null,
      type: { value: type, label: type },
      username: query.username ?? '',
      sampleCode: query.sampleCode ?? '',
      sortField: { value: sortField, label: selectField[sortField] },
      sortDirection: {
        value: sortDirection,
        label: selectOrder[sortDirection],
      },
    },
    setQuery,
  ];
}
