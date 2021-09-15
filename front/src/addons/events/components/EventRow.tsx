import React from 'react';

import { getTagColor } from '@/components/EventStatusLabel';
import { StatusLabel } from '@/components/StatusLabel';
import { Td } from '@/components/tailwind-ui';
import { EventStatus } from '@/generated/graphql';

interface EventRowProps {
  id: string;
  file: string;
  topic: string;
  status: EventStatus;
  processorId: string;
  processId: string;
  createdAt: string;
  date: string;
}
export default function EventRow({
  id,
  file,
  topic,
  status,
  processorId,
  processId,
  createdAt,
  date,
}: EventRowProps) {
  return (
    <tr>
      <Td title={id} className="truncate">
        {id}
      </Td>
      <Td>{file}</Td>
      <Td title={processorId} className="truncate">
        {processorId}
      </Td>
      <Td>{topic}</Td>
      <Td>
        <StatusLabel status={status} color={getTagColor(status)} />
      </Td>
      <Td title={processId} className="truncate">
        {processId}
      </Td>
      <Td>{createdAt}</Td>
      <Td>{date}</Td>
    </tr>
  );
}
