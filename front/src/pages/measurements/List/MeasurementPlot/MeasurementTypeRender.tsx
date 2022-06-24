import React, { useMemo } from 'react';

import { PlotJcampMultiple } from '@/components/PlotJcamp/PlotJcampMultiple';
import { Alert, AlertType } from '@/components/tailwind-ui';
import { MeasurementTypes } from '@/generated/graphql';
import { MeasurementMap } from '@/pages/measurements/models/BaseMeasurement';

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
        {error.map((err) => (
          <p key={err.name}>{err.message}</p>
        ))}
      </Alert>
    );
  }

  if (content.length === 0) return <svg {...size} />;

  const { plotQuery } = MeasurementMap[type];
  return <PlotJcampMultiple content={content} query={plotQuery} size={size} />;
}
