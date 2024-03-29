import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/solid';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { FileStatusLabel } from '@/components/FileStatusLabel';
import { DownloadButton } from '@/components/LinkButton';
import { StatusLabel } from '@/components/StatusLabel';
import { Td, Color } from '@/components/tailwind-ui';
import {
  EventStatus,
  FileStatus,
  useEventsByFileIdLazyQuery,
} from '@/generated/graphql';
import { formatBytes, formatDate } from '@/utils/formatFields';

import { ExpandCell } from './ExpandCell';
import { EventsProcessors, FileSync } from './types';

function getTagColor(status: EventStatus) {
  switch (status) {
    case EventStatus.SUCCESS: {
      return Color.success;
    }
    case EventStatus.ERROR: {
      return Color.danger;
    }
    default: {
      return Color.warning;
    }
  }
}

type EventsByProcessor = Omit<EventsProcessors, 'status' | 'date'> & {
  status?: EventStatus;
  date?: Date;
};

export default function FileRow({ value }: { value: FileSync }) {
  const [fetchChild, { called, data }] = useEventsByFileIdLazyQuery({
    variables: { id: value.id },
  });
  const events = useMemo(() => {
    if (!data) return [];
    let res: EventsByProcessor[] = [];
    for (const { topic, processors } of data.events.list) {
      if (processors.length !== 0) {
        for (const { processorId, history } of processors) {
          res.push({
            topic,
            processorId,
            status: history[0]?.status,
            date: history[0]?.date,
          });
        }
      } else {
        res.push({
          topic,
          processorId: '',
        });
      }
    }
    return res;
  }, [data]);

  return (
    <>
      <tr>
        <ExpandCell
          title={value.relativePath}
          value={value}
          called={called}
          fetchChild={fetchChild}
          icon={<DocumentTextIcon className="mr-1 h-5 w-5" />}
        />
        <Td>{formatBytes(value.size)}</Td>
        <Td>{formatDate(value.date)}</Td>
        <Td>{value.countRevisions}</Td>
        <Td>
          <FileStatusLabel status={value.status} />
        </Td>
        <Td>
          {value.status !== FileStatus.IMPORTED ? null : (
            <DownloadButton
              to={value.downloadUrl}
              color={Color.neutral}
              className="ml-2"
              title="Download"
            >
              <DownloadIcon className="h-3 w-3" />
            </DownloadButton>
          )}
        </Td>
      </tr>
      {value.expanded &&
        (events.length === 0 ? (
          <tr>
            <Td>
              <span className="pl-8 font-light">No events</span>
            </Td>
          </tr>
        ) : (
          events.map(
            (
              { topic, processorId, status = EventStatus.PENDING, date },
              index,
            ) => {
              const color = getTagColor(status);
              return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={processorId + topic + index}>
                  <Td className="flex">
                    <Link
                      className="pr-2"
                      to={`/event/list?topic.value=${topic}&topic.operator=equals`}
                    >
                      <span className="pr-1 font-bold text-alternative-600">
                        Topic:
                      </span>
                      {topic}
                    </Link>
                    {processorId ? (
                      <Link
                        className="pr-2"
                        to={`/event/list?processorId.value=${processorId}&processorId.operator=equals`}
                      >
                        <span className="pr-1 font-bold text-alternative-600">
                          Processor:
                        </span>
                        {processorId}
                      </Link>
                    ) : null}
                  </Td>
                  <Td />
                  <Td>{date ? formatDate(date) : ''}</Td>
                  <Td />
                  <Td>
                    <Link to={`/event/list?status=${status}`}>
                      <StatusLabel status={status} color={color} />
                    </Link>
                  </Td>
                  <Td />
                </tr>
              );
            },
          )
        ))}
    </>
  );
}
