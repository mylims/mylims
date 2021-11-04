import {
  InformationCircleIcon,
  AnnotationIcon,
  DownloadIcon,
} from '@heroicons/react/outline';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { MeasurementPlotContext } from './MeasurementPlot';

import {
  Button,
  Color,
  Roundness,
  Td,
  Variant,
} from '@/components/tailwind-ui';

interface MeasurementRowProps {
  id: string;
  eventId: string;
  username: string;
  sampleCode: string[];
  createdAt: string;
  downloadUrl?: string | null;
}
export default function MeasurementRow({
  id,
  eventId,
  username,
  sampleCode,
  createdAt,
  downloadUrl,
}: MeasurementRowProps) {
  const { enabled, state, setState } = useContext(MeasurementPlotContext);
  return (
    <tr>
      <Td>{sampleCode.join('/')}</Td>
      <Td>{createdAt}</Td>
      <Td>{username}</Td>
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
              color={Color.primary}
              roundness={Roundness.circular}
              variant={Variant.secondary}
              className="ml-2"
            >
              <AnnotationIcon className="w-5 h-5" />
            </Button>
          </Link>
          {downloadUrl && (
            <a href={downloadUrl} target="_blank" rel="noreferrer">
              <Button
                color={Color.neutral}
                roundness={Roundness.circular}
                variant={Variant.secondary}
                className="ml-2"
              >
                <DownloadIcon className="w-5 h-5" />
              </Button>
            </a>
          )}
          {enabled && downloadUrl && (
            <Button
              color={Color.success}
              variant={state[id] ? Variant.primary : Variant.secondary}
              className="ml-2"
              onClick={() => {
                setState((prevState) => {
                  const { [id]: currElement, ...restState } = prevState;
                  if (currElement) {
                    return restState;
                  } else {
                    return { ...prevState, [id]: downloadUrl };
                  }
                });
              }}
            >
              {state[id] ? '- plot' : '+ plot'}
            </Button>
          )}
        </div>
      </Td>
    </tr>
  );
}
