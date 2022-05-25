import { InformationCircleIcon, DownloadIcon } from '@heroicons/react/outline';
import React, { useContext } from 'react';

import { DownloadButton, LinkIcon } from '@/components/LinkButton';
import { Button, Color, Variant } from '@/components/tailwind-ui';

import { MeasurementPlotContext } from './MeasurementPlot';

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
      <LinkIcon title="detail" to={`../detail/${type}/${id}`} className="ml-2">
        <InformationCircleIcon className="h-5 w-5" />
      </LinkIcon>
      {fileUrl && (
        <DownloadButton to={fileUrl} color={Color.neutral} className="ml-2">
          <DownloadIcon className="h-5 w-5" />
        </DownloadButton>
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
