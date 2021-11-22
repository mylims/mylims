import { InformationCircleIcon } from '@heroicons/react/outline';
import React from 'react';
import { Link } from 'react-router-dom';

import { getTagColor } from '@/components/EventStatusLabel';
import { StatusLabel } from '@/components/StatusLabel';
import {
  Button,
  Color,
  Roundness,
  Td,
  Variant,
} from '@/components/tailwind-ui';
import { EventStatus } from '@/generated/graphql';

interface EventRowProps {
  id: string;
  file: string;
  topic: string;
  status: EventStatus;
  processorId: string;
  createdAt: string;
  date: string;
}
export default function EventRow({
  id,
  file,
  topic,
  status,
  processorId,
  createdAt,
  date,
}: EventRowProps) {
  return (
    <tr>
      <Td>{file}</Td>
      <Td title={processorId} className="truncate">
        {processorId}
      </Td>
      <Td>{topic}</Td>
      <Td>
        <StatusLabel status={status} color={getTagColor(status)} />
      </Td>
      <Td>{createdAt}</Td>
      <Td>{date}</Td>
      <Td>
        <Link title="detail" to={`/event/detail/${id}`}>
          <Button
            color={Color.primary}
            roundness={Roundness.circular}
            variant={Variant.secondary}
          >
            <InformationCircleIcon className="w-5 h-5" />
          </Button>
        </Link>
      </Td>
    </tr>
  );
}