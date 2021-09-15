import React, { useMemo } from 'react';

import ElnLayout from '@/components/ElnLayout';
import { StatusLabel } from '@/components/StatusLabel';
import TableEmpty from '@/components/TableEmpty';
import TableHeader from '@/components/TableHeader';
import {
  Alert,
  AlertType,
  Spinner,
  Table,
  Td,
  Color,
} from '@/components/tailwind-ui';
import {
  EventsFilteredQuery,
  EventStatus,
  useEventsFilteredQuery,
} from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

type EventRowType = EventsFilteredQuery['events']['events'][number] & {
  id: string;
};

const PAGE_SIZE = 10;
const titles = [
  { className: 'w-2/12', name: 'File' },
  { className: 'w-2/12', name: 'Processor id' },
  { className: 'w-1/12', name: 'Topic' },
  { className: 'w-1/12', name: 'Status' },
  { className: 'w-2/12', name: 'Process id' },
  { className: 'w-1/12', name: 'Date' },
];

export default function EventsList() {
  const pageNum = 1;
  const { loading, error, data } = useEventsFilteredQuery({
    variables: {
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    },
  });
  const events = useMemo(
    () =>
      (data?.events.events ?? []).map((event) => ({ ...event, id: event._id })),
    [data],
  );
  const pagination = {
    page: pageNum,
    itemsPerPage: PAGE_SIZE,
    totalCount: data?.events.totalCount ?? 0,
    onPageChange: (newPage: number) => console.log(newPage),
  };
  return (
    <>
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
          data={events}
          pagination={pagination}
        />
      )}
    </>
  );
}

function Row({ value }: { value: EventRowType }) {
  if (value.processors.length === 0) {
    return (
      <EventRow
        file={value.data.file.name}
        topic={value.topic}
        status={EventStatus.PENDING}
        processId="-"
        processorId="-"
        date="-"
      />
    );
  }

  const processors = value.processors.map((processor) => {
    const date = processor.history[0]?.date;
    return (
      <EventRow
        key={processor.processorId}
        file={value.data.file.name}
        topic={value.topic}
        status={processor.history[0]?.status.trim() ?? EventStatus.PENDING}
        processId={processor.history[0]?.processId ?? '-'}
        processorId={processor.processorId}
        date={date ? formatDate(date) : '-'}
      />
    );
  });

  return <>{processors}</>;
}

interface EventRowProps {
  file: string;
  topic: string;
  status: string;
  processorId: string;
  processId: string;
  date: string;
}
function EventRow({
  file,
  topic,
  status,
  processorId,
  processId,
  date,
}: EventRowProps) {
  let color: Color;
  switch (status) {
    case EventStatus.SUCCESS: {
      color = Color.success;
      break;
    }
    case EventStatus.ERROR: {
      color = Color.danger;
      break;
    }
    default: {
      color = Color.warning;
      break;
    }
  }

  return (
    <tr>
      <Td>{file}</Td>
      <Td title={processorId} className="truncate">
        {processorId}
      </Td>
      <Td>{topic}</Td>
      <Td>
        <StatusLabel status={status} color={color} />
      </Td>
      <Td title={processId} className="truncate">
        {processId}
      </Td>
      <Td>{date}</Td>
    </tr>
  );
}

EventsList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
