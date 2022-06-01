/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Annotation } from 'react-plot';

import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
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

const dashedLine = { strokeWidth: 2, opacity: 0.75, strokeDasharray: '5,5' };

export class XRayModel implements BaseMeasurement {
  public type = MeasurementTypes.XRAY;
  public plotQuery = { xLabel: 'x', yLabel: 'y' };
  public Form() {
    return <></>;
  }
  public PlotDetail({ measurement, data }: PlotDetailProps): JSX.Element {
    // const { peaks } = measurement?.derived ?? ({} as XRayDerived);
    return <PlotJcampSingle content={data} initialQuery={this.plotQuery} />;
  }
}
