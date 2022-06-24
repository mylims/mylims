import { Analysis, toJcamp } from 'base-analysis';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { PlotController, PlotObject } from 'react-plot';

import { ZoomAnnotation } from '@/components/PlotJcamp/ZoomAnnotation';
import { PlotQuery } from '@/components/PlotJcamp/types';
import { getPlotJcamp } from '@/components/PlotJcamp/utils';
import { useCheckedFormRHFContext } from '@/components/tailwind-ui';
import { MeasurementTypes } from '@/generated/graphql';
import { MeasurementMap } from '@/pages/measurements/models/BaseMeasurement';

export interface PlotSingleRHFProps {
  name: string;
  type: MeasurementTypes;
  children?: (analysis: Analysis, query: PlotQuery) => ReactNode;
}
export function PlotSingleRHF({ name, type, children }: PlotSingleRHFProps) {
  const { field } = useController({ name });
  const { setValue } = useCheckedFormRHFContext();
  const [content, setContent] = useState<Analysis[]>([]);
  const Measurement = useMemo(() => MeasurementMap[type], [type]);

  // Reads the jcamp from original file
  useEffect(() => {
    if (field.value[0]) {
      (field.value[0] as File)
        .text()
        .then((value) => {
          const analysis = Measurement.toAnalysis(value);
          const jcamp = toJcamp(analysis[0]);
          setValue('jcamp', jcamp, {
            shouldTouch: true,
            shouldValidate: false,
          });
          setContent(analysis);
        })
        .catch(() => setContent([]));
    }
  }, [field.value, Measurement, setValue]);

  const plotContent = useMemo(() => {
    const analysis = content[0];
    if (!analysis || analysis.measurements.length === 0) return null;
    const plot = getPlotJcamp(Measurement.plotQuery, [analysis], {
      width: 600,
      height: 500,
    });
    Measurement.setMetadata(plot.meta[0], setValue);
    return plot;
  }, [content, Measurement, setValue]);

  if (!plotContent || content.length === 0) return null;

  return (
    <PlotController>
      <PlotObject plot={plotContent}>
        {children?.(content[0], Measurement.plotQuery)}
        <ZoomAnnotation />
      </PlotObject>
    </PlotController>
  );
}
