import React, { useMemo } from 'react';

import { PlotJcampMultiple } from '@/components/PlotJcamp/PlotJcampMultiple';
import type { PlotQuery } from '@/components/PlotJcamp/types';
import { Alert, AlertType } from '@/components/tailwind-ui';
import { MeasurementTypes } from '@/generated/graphql';

interface MeasurementTypesProps {
  type: MeasurementTypes;
  data: Record<string, string | null>;
  error: Error[];
}

const size = { width: 300, height: 250 };
export default function MeasurementTypeRender({
  type,
  data,
  error,
}: MeasurementTypesProps) {
  const content = useMemo(
    () => Object.values(data).filter((val): val is string => val !== null),
    [data],
  );

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

  if (content.length === 0) return <svg {...size} />;

  let query: PlotQuery;
  switch (type) {
    case MeasurementTypes.TRANSFER: {
      query = {
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
        scale: 'log',
        logFilter: 'remove',
      };
      break;
    }
    default: {
      query = {
        xLabel: 'Vg',
        xUnits: 'V',
        yLabel: 'Id_dens',
        yUnits: 'A/mm',
        scale: 'linear',
      };
    }
  }
  return <PlotJcampMultiple content={content} query={query} size={size} />;
}