import { InformationCircleIcon } from '@heroicons/react/outline';
import objectPath from 'object-path';
import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import { EventStatusLabel } from '@/components/EventStatusLabel';
import { LinkIcon } from '@/components/LinkButton';
import { TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { Unflatten } from '@/components/TableQuery/types';
import { getVariablesFromQuery } from '@/components/TableQuery/utils';
import {
  EventFilterInput,
  EventSortField,
  EventSortInput,
  EventStatus,
  SortDirection,
  useEventsFilteredQuery,
} from '@/generated/graphql';

type EventFilter = Exclude<EventFilterInput, 'status'> & {
  status: string | null;
};
type EventsFilterType = Unflatten<EventFilter, EventSortInput>;
export default function EventsList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.direction': SortDirection.DESC,
    'sortBy.field': EventSortField.CREATEDAT,
  });

  const {
    filterBy: { status, ...filter },
    ...variables
  } = getVariablesFromQuery<EventsFilterType>(query);
  const { loading, error, data } = useEventsFilteredQuery({
    variables: {
      ...variables,
      filterBy: {
        ...filter,
        status:
          status
            ?.split(',')
            .filter<EventStatus>((value): value is EventStatus => !!value) ??
          null,
      },
    },
  });

  return (
    <div>
      <TableQuery
        data={data?.events}
        loading={loading}
        error={error}
        query={query}
        onQueryChange={(query) => setQuery(query)}
      >
        <TableQuery.Queries />
        <TableQuery.TextColumn
          title="Original file"
          dataPath="data.file.name"
          disableSearch
        />
        <TableQuery.TextColumn
          title="Processor id"
          queryPath="processorId"
          dataPath="processors.0.processorId"
        />
        <TableQuery.TextColumn title="Topic" dataPath="topic" />
        <TableQuery.MultiSelectColumn
          title="Status"
          dataPath="processors.0.history.0.status"
          queryPath="status"
          options={[
            EventStatus.PENDING,
            EventStatus.PROCESSING,
            EventStatus.ERROR,
            EventStatus.SUCCESS,
          ]}
        >
          {(row) => {
            const status = objectPath.get(
              row,
              'processors.0.history.0.status',
              EventStatus.PENDING,
            );
            return <EventStatusLabel status={status} />;
          }}
        </TableQuery.MultiSelectColumn>
        <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
        <TableQuery.DateColumn
          title="Process date"
          dataPath="processors.0.history.0.date"
          disableSort
        />
        <TableQuery.ActionsColumn>
          {({ id }) => (
            <LinkIcon title="detail" to={`../detail/${id as string}`}>
              <InformationCircleIcon className="h-5 w-5" />
            </LinkIcon>
          )}
        </TableQuery.ActionsColumn>
      </TableQuery>
    </div>
  );
}

EventsList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
