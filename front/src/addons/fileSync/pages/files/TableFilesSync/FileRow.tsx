import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/solid';
import React, { useContext, useMemo } from 'react';

import ExpandButton from '@components/ExpandButton';
import { FileStatusLabel } from '@components/FileStatusLabel';
import { StatusLabel } from '@components/StatusLabel';
import { Td, Button, Color, Roundness, Variant } from '@components/tailwind-ui';

import {
  EventStatus,
  useEventsByFileIdLazyQuery,
} from '../../../generated/graphql';

import { changeNodeValue, TreeContext } from './TreeContext';
import { EventsProcessors, FileSync } from './types';
import { formatBytes, formatDate } from '@utils/formatFields';

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

export default function FileRow({ value }: { value: FileSync }) {
  const context = useContext(TreeContext);
  const [fetchChild, { called, data }] = useEventsByFileIdLazyQuery({
    variables: { id: value.id },
  });
  const events = useMemo(() => {
    if (!data) return [];
    let res: EventsProcessors[] = [];
    for (const { topic, processors } of data.eventsByFileId) {
      for (const { processorId, history } of processors) {
        res.push({
          topic,
          processorId,
          status: history[0]?.status,
          date: history[0]?.date,
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
                  node.expanded = !node.expanded;
                  return node;
                }),
              );
              if (!called) fetchChild();
            }}
            expanded={value.expanded}
          />
          <DocumentTextIcon className="w-5 h-5 mr-1" />
          {value.name}
        </Td>
        <Td>{formatBytes(value.size)}</Td>
        <Td>{formatDate(value.date)}</Td>
        <Td>{value.countRevisions}</Td>
        <Td>
          <FileStatusLabel status={value.status} />
        </Td>
        <Td>
          <a href={value.downloadUrl} target="_blank" rel="noreferrer">
            <Button
              color={Color.neutral}
              roundness={Roundness.circular}
              variant={Variant.secondary}
              className="ml-2"
              title="Download"
            >
              <DownloadIcon className="w-3 h-3" />
            </Button>
          </a>
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
          events.map(({ topic, processorId, status, date }) => {
            const color = getTagColor(status);
            return (
              <tr key={processorId}>
                <Td className="flex">
                  <div className="pr-2">
                    <span className="pr-1 font-bold text-alternative-600">
                      Topic:
                    </span>
                    {topic}
                  </div>
                  <div className="pr-2">
                    <span className="pr-1 font-bold text-alternative-600">
                      Processor:
                    </span>
                    {processorId}
                  </div>
                </Td>
                <Td />
                <Td>{formatDate(date)}</Td>
                <Td />
                <Td>
                  <StatusLabel status={status} color={color} />
                </Td>
                <Td />
              </tr>
            );
          })
        ))}
    </>
  );
}
