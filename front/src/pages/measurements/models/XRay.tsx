import React from 'react';
import { fromXRC } from 'xray-analysis';

import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
import { Table as TableQuery } from '@/components/TableQuery';
import { MeasurementTypes } from '@/generated/graphql';

import { BaseMeasurement, PlotDetailProps } from './BaseMeasurement';

interface Peak {
  x: number;
  y: number;
  shape?: { kind: 'pseudoVoigt'; fwhm?: number; mu?: number };
  parameters?: Record<
    string,
    { init?: number; min?: number; max?: number; gradientDifference?: number }
  >;
}
export interface XRayDerived {
  peaks: Peak[];
}

export const XRayModel: BaseMeasurement = {
  type: MeasurementTypes.XRAY,
  plotQuery: { xLabel: 'x', yLabel: 'y' },
  setMetadata() {
    // No metadata to set
  },
  PlotDetail({ data }: PlotDetailProps): JSX.Element {
    return (
      <PlotJcampSingle content={data} initialQuery={XRayModel.plotQuery} />
    );
  },
  metaColumns: [
    <TableQuery.NumberColumn
      key="peaks"
      title="Number of peaks"
      dataPath="derived.peaks.length"
      disableSort
    />,
  ],
  toAnalysis(data: string) {
    return [fromXRC(data)];
  },
};
