import React from 'react';
import { Annotation } from 'react-plot';

import FieldDescription from '@/components/FieldDescription';
import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
import { Alert, AlertType, Card } from '@/components/tailwind-ui';
import { MeasurementQuery } from '@/generated/graphql';
import { useFetchFile } from '@/hooks/useFetchFile';
import { formatDate } from '@/utils/formatFields';

interface Derived {
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

export default function B1505Transfer(
  measurement: MeasurementQuery['measurement'],
) {
  const { data, error } = useFetchFile(
    measurement.fileId ?? null,
    measurement.file?.downloadUrl ?? null,
  );

  if (error) {
    return (
      <Card.Body>
        <Alert
          title="Error while fetching measurement plot"
          type={AlertType.ERROR}
        >
          Unexpected error: {error?.message}
        </Alert>
      </Card.Body>
    );
  }

  const { thresholdVoltage, subthresholdSlope } =
    measurement?.derived ?? ({} as Derived);
  return (
    <Card.Body>
      <div className="flex flex-col lg:w-full lg:flex-row lg:gap-4">
        <div className="lg:w-1/2">
          <div className="grid-cols-auto mb-4 grid items-end gap-4">
            <FieldDescription title="Sample code">
              {measurement.sample.sampleCode.join('_')}
            </FieldDescription>
            <FieldDescription title="Owner's username">
              {measurement.user?.usernames[0]}
            </FieldDescription>
            <FieldDescription title="Creation date">
              {formatDate(measurement.createdAt)}
            </FieldDescription>
            {measurement.file && (
              <div>
                <div className="font-medium">File name</div>
                <div
                  className="truncate text-neutral-500"
                  title={measurement.file.filename}
                >
                  {measurement.file.filename}
                </div>
              </div>
            )}
            <FieldDescription title="Comment">
              {measurement.comment ?? '-'}
            </FieldDescription>
          </div>
        </div>
        <div className="flex flex-col-reverse items-end gap-2 lg:w-1/2">
          <PlotJcampSingle
            content={data}
            initialQuery={{
              xLabel: 'Vg',
              xUnits: 'V',
              yLabel: 'Id_dens',
              yUnits: 'A/mm',
              scale: 'log',
              logFilter: 'remove',
            }}
          >
            {(analysis, query) => {
              if (query.xLabel === 'Vg' && query.yLabel === 'Id_dens') {
                const spectrum = analysis.getMeasurementXY(query);
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
        </div>
      </div>
    </Card.Body>
  );
}
