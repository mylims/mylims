import {
  InformationCircleIcon,
  AnnotationIcon,
  DownloadIcon,
} from '@heroicons/react/outline';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Color,
  Roundness,
  Td,
  Variant,
} from '@/components/tailwind-ui';
import { API_URL } from '@/../env';

interface MeasurementRowProps {
  id: string;
  eventId: string;
  username: string;
  sampleCode: string[];
  createdAt: string;
  createdBy: string;
  fileId?: string | null;
}
export default function MeasurementRow({
  id,
  eventId,
  username,
  sampleCode,
  createdAt,
  createdBy,
  fileId,
}: MeasurementRowProps) {
  return (
    <tr>
      <Td>{sampleCode.join('/')}</Td>
      <Td>{createdAt}</Td>
      <Td>{username}</Td>
      <Td>{createdBy}</Td>
      <Td>
        <div className="flex">
          <Link title="detail" to={`/measurement/detail/${id}`}>
            <Button
              color={Color.primary}
              roundness={Roundness.circular}
              variant={Variant.secondary}
              className="ml-2"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </Button>
          </Link>
          <Link title="event" to={`/event/detail/${eventId}`}>
            <Button
              color={Color.alternative}
              roundness={Roundness.circular}
              variant={Variant.secondary}
              className="ml-2"
            >
              <AnnotationIcon className="w-5 h-5" />
            </Button>
          </Link>
          {fileId && (
            <Link
              title="download file"
              to={`${API_URL}/addons/file-sync/file-content?id=${fileId}`}
            >
              <Button
                color={Color.neutral}
                roundness={Roundness.circular}
                variant={Variant.secondary}
                className="ml-2"
              >
                <DownloadIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </Td>
    </tr>
  );
}
