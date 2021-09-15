import React, { useMemo } from 'react';

import ElnLayout from '@/components/ElnLayout';
import {
  EventsFilteredQuery,
  EventStatus,
  useEventsFilteredQuery,
} from '@/generated/graphql';
import {
  Alert,
  AlertType,
  Spinner,
  Table,
  Th,
  Td,
  Color,
} from '@/components/tailwind-ui';
import { InboxIcon } from '@heroicons/react/solid';
import { formatDate } from '@/utils/formatFields';
import { StatusLabel } from '@/components/StatusLabel';

type EventRow = EventsFilteredQuery['events']['events'][number] & {
  id: string;
};

const PAGE_SIZE = 10;

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
          Header={Header}
          Empty={Empty}
          Tr={Row}
          data={events}
          pagination={pagination}
        />
      )}
    </>
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-2/12">File</Th>
      <Th className="w-2/12">Processor id</Th>
      <Th className="w-1/12">Topic</Th>
      <Th className="w-1/12">Status</Th>
      <Th className="w-2/12">Process id</Th>
      <Th className="w-1/12">Date</Th>
    </tr>
  );
}

function Empty() {
  return (
    <>
      <Header />
      <tr>
        <Td colSpan={4} align="center">
          <div className="flex flex-row justify-center text-neutral-500">
            <InboxIcon className="w-5 h-5 mr-2" />
            <span>Empty</span>
          </div>
        </Td>
      </tr>
    </>
  );
}

function Row({ value }: { value: EventRow }) {
  if (value.processors.length === 0) {
    return (
      <EventRow
        file={value.data.fileId}
        topic={value.topic}
        status={EventStatus.PENDING}
        processId=""
        processorId=""
        date=""
      />
    );
  }

  const processors = value.processors.map((processor) => {
    const date = processor.history[0]?.date;
    return (
      <EventRow
        key={processor.processorId}
        file={value.data.fileId}
        topic={value.topic}
        status={processor.history[0]?.status.trim() ?? EventStatus.PENDING}
        processId={processor.history[0]?.processId ?? ''}
        processorId={processor.processorId}
        date={date ? formatDate(date) : ''}
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
