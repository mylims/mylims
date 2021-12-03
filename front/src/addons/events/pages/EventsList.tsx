import { InformationCircleIcon } from '@heroicons/react/outline';
import objectPath from 'object-path';
import React from 'react';
import { Link } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { EventStatusLabel } from '@/components/EventStatusLabel';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { Button, Color, Roundness, Variant } from '@/components/tailwind-ui';
import {
  EventSortField,
  EventStatus,
  SortDirection,
  useEventsFilteredQuery,
} from '@/generated/graphql';

export default function EventsList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    sortField: EventSortField.CREATEDAT,
    sortDirection: SortDirection.DESC,
  });
  const { page, status, sortField, sortDirection, ...filter } = query;
  const { skip, limit } = boundariesFromPage(page);
  const { loading, error, data } = useEventsFilteredQuery({
    variables: {
      skip,
      limit,
      filterBy: {
        ...filter,
        status:
          status
            ?.split(',')
            .filter<EventStatus>((value): value is EventStatus => !!value) ??
          null,
      },
      sortBy: {
        direction: sortDirection as SortDirection,
        field: sortField as EventSortField,
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
        />
        <TableQuery.ActionsColumn>
          {({ id }) => (
            <Link title="detail" to={`/event/detail/${id as string}`}>
              <Button
                color={Color.primary}
                roundness={Roundness.circular}
                variant={Variant.secondary}
              >
                <InformationCircleIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </TableQuery.ActionsColumn>
      </TableQuery>
    </div>
  );
}

EventsList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
