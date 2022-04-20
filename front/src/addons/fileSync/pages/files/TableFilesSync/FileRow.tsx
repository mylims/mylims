import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/solid';
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import ExpandButton from '@/components/ExpandButton';
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

import { changeNodeValue, TreeContext } from './TreeContext';
import { EventsProcessors, FileSync, TreeType } from './types';

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
  const context = useContext(TreeContext);
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
        <Td
          title={value.relativePath}
          className="flex items-center truncate"
          style={{ paddingLeft: `${1.5 + 1.5 * value.path.length}rem` }}
        >
          <ExpandButton
            onExpand={() => {
              context.setState(
                changeNodeValue(context.state, value.path, value.id, (node) => {
                  if (node.type !== TreeType.limit) {
                    node.expanded = !node.expanded;
                  }
                  return node;
                }),
              );
              // eslint-disable-next-line no-console
              if (!called) fetchChild().catch(console.error);
            }}
            expanded={value.expanded}
          />
          <DocumentTextIcon className="mr-1 h-5 w-5" />
          {value.name}
        </Td>
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
