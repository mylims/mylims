import { fromTransfer } from 'iv-analysis';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { Annotation } from 'react-plot';

import FieldDescription from '@/components/FieldDescription';
import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
import { Table as TableQuery } from '@/components/TableQuery';
import { MeasurementTypes } from '@/generated/graphql';

import { BaseMeasurement, PlotDetailProps } from './BaseMeasurement';

export interface TransferDerived {
  thresholdVoltage: {
    index: number;
    value: number;
  };
  subthresholdSlope: {
    slope: number;
    toIndex: number;
    fromIndex: number;
    score: Record<string, number>;
  };
}

const dashedLine = { strokeWidth: 2, opacity: 0.75, strokeDasharray: '5,5' };
const underline = (color: string) => ({
  textDecoration: 'underline',
  WebkitTextDecorationColor: color,
  textDecorationColor: color,
  textDecorationThickness: '2px',
});

export const TransferModel: BaseMeasurement = {
  type: MeasurementTypes.TRANSFER,
  plotQuery: {
    xLabel: 'Vg',
    xUnits: 'V',
    yLabel: 'Id_dens',
    yUnits: 'A/mm',
    scale: 'log' as const,
    logFilter: 'remove' as const,
  },
  setMetadata(
    meta: Record<string, string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<Record<string, any>>,
  ) {
    const { thresholdVoltage, subthresholdSlope } = meta;
    setValue(
      'derived.thresholdVoltage.value',
      JSON.parse(thresholdVoltage).value,
      { shouldTouch: true, shouldValidate: false },
    );
    setValue(
      'derived.subthresholdSlope.slope',
      JSON.parse(subthresholdSlope).slope.value,
      { shouldTouch: true, shouldValidate: false },
    );
  },
  PlotDetail({ measurement, data }: PlotDetailProps): JSX.Element {
    const { thresholdVoltage, subthresholdSlope } =
      measurement?.derived ?? ({} as TransferDerived);
    return (
      <>
        <PlotJcampSingle content={data} initialQuery={TransferModel.plotQuery}>
          {(analysis, { xLabel, xUnits, yLabel, yUnits }) => {
            if (xLabel === 'Vg' && yLabel === 'Id_dens') {
              const spectrum = analysis.getMeasurementXY({
                x: { label: xLabel, units: xUnits },
                y: { label: yLabel, units: yUnits },
              });
              const { x, y } = spectrum?.variables || {};
              return (
                <>
                  <Annotation.Line
                    x1={thresholdVoltage.value}
                    x2={thresholdVoltage.value}
                    y1={y?.min ?? '0%'}
                    y2={y?.max ?? '100%'}
                    style={{ stroke: 'green', ...dashedLine }}
                  />
                  <Annotation.Circle
                    x={thresholdVoltage.value}
                    y={1e-6}
                    r="4"
                    style={{ fill: 'green' }}
                  />
                  {x && y && (
                    <>
                      <Annotation.Line
                        x1={x.data[subthresholdSlope.fromIndex]}
                        x2={x.data[subthresholdSlope.toIndex]}
                        y1={y.data[subthresholdSlope.fromIndex]}
                        y2={y.data[subthresholdSlope.toIndex]}
                        style={{ stroke: 'blue', ...dashedLine }}
                      />
                      <Annotation.Circle
                        x={x.data[subthresholdSlope.fromIndex]}
                        y={y.data[subthresholdSlope.fromIndex]}
                        r="4"
                        style={{ fill: 'blue' }}
                      />
                      <Annotation.Circle
                        x={x.data[subthresholdSlope.toIndex]}
                        y={y.data[subthresholdSlope.toIndex]}
                        r="4"
                        style={{ fill: 'blue' }}
                      />
                    </>
                  )}
                </>
              );
            }
            return null;
          }}
        </PlotJcampSingle>
        <div>
          <FieldDescription
            title="Threshold voltage"
            titleStyle={underline('green')}
          >
            {thresholdVoltage.value.toFixed(4)} V
          </FieldDescription>
          <FieldDescription
            title="Subthreshold slope"
            titleStyle={underline('blue')}
          >
            {(subthresholdSlope.slope * 1000).toFixed(4)} mV/dec
          </FieldDescription>
        </div>
      </>
    );
  },
  metaColumns: [
    <TableQuery.NumberColumn
      key="subthresholdSlope"
      title="Subthreshold slope"
      dataPath="derived.subthresholdSlope.slope"
      format="0.0000"
      disableSort
    />,
    <TableQuery.NumberColumn
      key="thresholdVoltage"
      title="Threshold voltage"
      dataPath="derived.thresholdVoltage.value"
      disableSort
    />,
  ],
  toAnalysis(data: string) {
    return fromTransfer(data);
  },
};
