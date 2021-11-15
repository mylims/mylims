import React from 'react';

import EventRow from '../components/EventRow';

import EventFormFilter from '@/addons/events/components/EventFormFilter';
import ElnLayout from '@/components/ElnLayout';
import TableEmpty from '@/components/TableEmpty';
import TableHeader from '@/components/TableHeader';
import { Alert, AlertType, Spinner, Table } from '@/components/tailwind-ui';
import {
  EventsFilteredQuery,
  EventStatus,
  useEventsFilteredQuery,
} from '@/generated/graphql';
import { useFilterEventQuery } from '@/hooks/useEventQuery';
import { formatDate } from '@/utils/formatFields';

type EventRowType = EventsFilteredQuery['events']['list'][number] & {
  id: string;
};

const PAGE_SIZE = 10;
const titles = [
  { className: 'w-2/12', name: 'Original file' },
  { className: 'w-2/12', name: 'Processor id' },
  { className: 'w-1/12', name: 'Topic' },
  { className: 'w-1/12', name: 'Status' },
  { className: 'w-1/12', name: 'Creation date' },
  { className: 'w-1/12', name: 'Process date' },
  { className: 'w-1/12', name: 'Actions' },
];

export default function EventsList() {
  const [query, setQuery] = useFilterEventQuery();
  const pageNum = query.page !== null ? parseInt(query.page, 10) : 1;
  const { loading, error, data } = useEventsFilteredQuery({
    variables: {
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        status: query.status?.map(({ value }) => value) ?? null,
        topic: query.topic,
        processorId: query.processorId,
      },
    },
  });

  const pagination = {
    page: pageNum,
    itemsPerPage: PAGE_SIZE,
    totalCount: data?.events.totalCount ?? 0,
    onPageChange: (newPage: number) =>
      setQuery({ ...query, page: newPage.toString() }),
  };

  return (
    <EventFormFilter
      initialValues={query}
      onSubmit={(values) => setQuery(values)}
    >
      {error && (
        <Alert title={'Error'} type={AlertType.ERROR}>
          Unexpected error: {error.message}
        </Alert>
      )}

      {loading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <Table
          tableClassName="table-fixed"
          Header={() => <TableHeader titles={titles} />}
          Empty={() => <TableEmpty titles={titles} />}
          Tr={Row}
          data={data?.events.list ?? []}
          pagination={pagination}
        />
      )}
    </EventFormFilter>
  );
}

function Row({ value }: { value: EventRowType }) {
  if (value.processors.length === 0) {
    return (
      <EventRow
        id={value.id}
        file={value.data.file.name}
        topic={value.topic}
        status={EventStatus.PENDING}
        processorId="-"
        date="-"
        createdAt={formatDate(value.createdAt)}
      />
    );
  }

  const processors = value.processors.map((processor) => {
    const date = processor.history[0]?.date;
    return (
      <EventRow
        key={processor.processorId}
        id={value.id}
        file={value.data.file.name}
        topic={value.topic}
        status={
          (processor.history[0]?.status.trim() ??
            EventStatus.PENDING) as EventStatus
        }
        processorId={processor.processorId}
        date={date ? formatDate(date) : '-'}
        createdAt={formatDate(value.createdAt)}
      />
    );
  });

  return <>{processors}</>;
}

EventsList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
