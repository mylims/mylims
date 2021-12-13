import { InformationCircleIcon, DownloadIcon } from '@heroicons/react/outline';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { MeasurementPlotContext } from './MeasurementPlot';

import { Button, Color, Roundness, Variant } from '@/components/tailwind-ui';

interface MeasurementActionsProps {
  type: string;
  id: string;
  fileUrl?: string;
}

export default function MeasurementActions({
  type,
  id,
  fileUrl,
}: MeasurementActionsProps) {
  const { state, setState } = useContext(MeasurementPlotContext);
  return (
    <div className="flex">
      <Link title="detail" to={`/measurement/detail/${type}/${id}`}>
        <Button
          color={Color.primary}
          roundness={Roundness.circular}
          variant={Variant.secondary}
          className="ml-2"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </Button>
      </Link>
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noreferrer">
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
      {fileUrl && (
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
                return { ...prevState, [id]: fileUrl };
              }
            });
          }}
        >
          {state[id] ? '- plot' : '+ plot'}
        </Button>
      )}
    </div>
  );
}