import { useHistory, useLocation } from 'react-router-dom';

import { useQuery } from './useQuery';

import {
  EventSortField,
  EventStatus,
  SortDirection,
} from '@/generated/graphql';

type Nullable<T> = { [P in keyof T]: T[P] | null };
interface FilterQuery {
  page: string;
  topic: string;
  processorId: string;
  status: Record<'value' | 'label', EventStatus>[];
  sortField: { value: EventSortField; label: string };
  sortDirection: { value: SortDirection; label: string };
}

export const selectOrder = {
  [SortDirection.ASC]: 'Ascend',
  [SortDirection.DESC]: 'Descend',
};
export const selectField = {
  [EventSortField.DATE]: 'Process date',
  [EventSortField.CREATEDAT]: 'Creation date',
  [EventSortField.TOPIC]: 'Topic',
  [EventSortField.PROCESSORID]: 'Processor Id',
  [EventSortField.STATUS]: 'Status',
};
export function useSetEventQuery() {
  const router = useHistory();
  const search = new URLSearchParams(useLocation().search);
  return (newQuery: Nullable<FilterQuery>) => {
    // set keys to url search params
    for (const [key, value] of Object.entries(newQuery)) {
      if (value !== null) {
        switch (key) {
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
            search.set(key, value as string);
          }
        }
      }
    }
    router.replace(`?${search.toString()}`);
  };
}

export function useFilterEventQuery(): [
  Nullable<FilterQuery>,
  (newQuery: Nullable<FilterQuery>) => void,
] {
  const setQuery = useSetEventQuery();
  const query = useQuery();
  const statusList = query.status?.split(',').map((s) => {
    const value = s.trim() as EventStatus;
    return { value, label: value };
  }) ?? [{ value: EventStatus.PENDING, label: EventStatus.PENDING }];
  const sortField =
    (query.sortField as EventSortField) || EventSortField.CREATEDAT;
  const sortDirection =
    (query.sortDirection as SortDirection) || SortDirection.DESC;

  return [
    {
      page: query.page ?? null,
      topic: query.topic ?? null,
      processorId: query.processorId ?? null,
      status: statusList,
      sortField: { value: sortField, label: selectField[sortField] },
      sortDirection: {
        value: sortDirection,
        label: selectOrder[sortDirection],
      },
    },
    setQuery,
  ];
}
