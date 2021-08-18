import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/solid';
import bytes from 'byte-size';
import { format } from 'date-fns';
import React, { useContext, useMemo } from 'react';

import ExpandButton from '@components/ExpandButton';
import { FileStatusLabel } from '@components/FileStatusLabel';
import { StatusLabel } from '@components/StatusLabel';
import { Td, Button, Color, Roundness, Variant } from '@components/tailwind-ui';

import { useEventsByFileIdLazyQuery } from '../../../generated/graphql';

import { changeNodeValue, TreeContext } from './TreeContext';
import { EventsProcessors, FileSync } from './types';

export default function FileRow({ value }: { value: FileSync }) {
  const size = bytes(value.size).toString();
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
        <Td>{size}</Td>
        <Td>{format(value.date, 'dd.MM.yyyy')}</Td>
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
          events.map(({ topic, processorId, status, date }) => (
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
              <Td>{format(new Date(date), 'dd.MM.yyyy')}</Td>
              <Td />
              <Td>
                <StatusLabel
                  status={status}
                  getTagColor={(status) => {
                    switch (status) {
                      case 'success': {
                        return Color.success;
                      }
                      case 'error': {
                        return Color.danger;
                      }
                      default: {
                        return Color.warning;
                      }
                    }
                  }}
                />
              </Td>
              <Td />
            </tr>
          ))
        ))}
    </>
  );
}
