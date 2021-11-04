import React, { useMemo } from 'react';

import { MeasurementTypes } from '@/generated/graphql';
import { Alert, AlertType } from '@/components/tailwind-ui';
import { PlotJcampMultiple } from '@/components/PlotJcampMultiple';

interface MeasurementTypesProps {
  type: MeasurementTypes;
  data: Record<string, string | null>;
  error: Error[];
}

export default function MeasurementTypeRender({
  type,
  data,
  error,
}: MeasurementTypesProps) {
  if (error.length !== 0) {
    return (
      <Alert title={'Error'} type={AlertType.ERROR}>
        <p>Unexpected errors:</p>
        {error.map((err, i) => (
          <p key={i}>{err.message}</p>
        ))}
      </Alert>
    );
  }

  const content = useMemo(
    () => Object.values(data).filter((val): val is string => val !== null),
    [data],
  );

  if (content.length === 0) return null;
  return (
    <PlotJcampMultiple
      content={content}
      query={{
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
        scale: 'log',
        logFilter: 'remove',
      }}
    />
  );
}
