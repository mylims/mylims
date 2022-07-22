import React from 'react';

import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
import { Alert, AlertType } from '@/components/tailwind-ui';
import { useFetchFile } from '@/hooks/useFetchFile';

interface PlotFromURLProps {
  fileId: string;
  fileUrl: string;
}

const plotQuery = {
  xLabel: 'Vg',
  xUnits: 'V',
  yLabel: 'Id_dens',
  yUnits: 'A/mm',
  scale: 'log' as const,
  logFilter: 'remove' as const,
};

export function PlotFromURL({ fileId, fileUrl }: PlotFromURLProps) {
  const { data, error } = useFetchFile(fileId, fileUrl);
  if (error) {
    return (
      <Alert
        title="Error while fetching measurement plot"
        type={AlertType.ERROR}
      >
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  return <PlotJcampSingle content={data} initialQuery={plotQuery} />;
}
