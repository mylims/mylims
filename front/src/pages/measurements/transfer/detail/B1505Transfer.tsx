import React from 'react';
import { Annotation } from 'react-plot';

import FieldDescription from '@/components/FieldDescription';
import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';
import { Alert, AlertType, Card } from '@/components/tailwind-ui';
import { useFetchFile } from '@/hooks/useFetchFile';

interface B1505TransferProps {
  file: null | { filename: string; downloadUrl: string; size: number };
  fileId: null | string;
  derived: {
    thresholdVoltage: {
      index: number;
      value: number;
    };
    subthresholdSlope: {
      medianSlope: number;
      toIndex: number;
      fromIndex: number;
    };
  };
}

const dashedLine = { strokeWidth: 2, opacity: 0.75, strokeDasharray: '5,5' };
const underline = (color: string) => ({
  textDecoration: 'underline',
  WebkitTextDecorationColor: color,
  textDecorationColor: color,
  textDecorationThickness: '2px',
});

export default function B1505Transfer({
  file,
  fileId,
  derived,
}: B1505TransferProps) {
  const { data, error } = useFetchFile(fileId, file?.downloadUrl ?? null);

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
  return (
    <Card.Body>
      <div className="flex justify-around">
        <div>
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
                      x1={derived.thresholdVoltage.value}
                      x2={derived.thresholdVoltage.value}
                      y1={y?.min ?? '0'}
                      y2={y?.max ?? '500'}
                      style={{ stroke: 'green', ...dashedLine }}
                    />
                    <Annotation.Circle
                      x={derived.thresholdVoltage.value}
                      y={1e-6}
                      r="4"
                      style={{ fill: 'green' }}
                    />
                    {x && y && (
                      <>
                        <Annotation.Line
                          x1={x.data[derived.subthresholdSlope.fromIndex]}
                          x2={x.data[derived.subthresholdSlope.toIndex]}
                          y1={y.data[derived.subthresholdSlope.fromIndex]}
                          y2={y.data[derived.subthresholdSlope.toIndex]}
                          style={{ stroke: 'blue', ...dashedLine }}
                        />
                        <Annotation.Circle
                          x={x.data[derived.subthresholdSlope.fromIndex]}
                          y={y.data[derived.subthresholdSlope.fromIndex]}
                          r="4"
                          style={{ fill: 'blue' }}
                        />
                        <Annotation.Circle
                          x={x.data[derived.subthresholdSlope.toIndex]}
                          y={y.data[derived.subthresholdSlope.toIndex]}
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
        </div>
        <div>
          <FieldDescription
            title="Threshold voltage"
            titleStyle={underline('green')}
          >
            {derived.thresholdVoltage.value.toFixed(4)} V
          </FieldDescription>
          <FieldDescription
            title="Subthreshold slope"
            titleStyle={underline('blue')}
          >
            {(derived.subthresholdSlope.medianSlope * 1000).toFixed(4)} mV/dec
          </FieldDescription>
        </div>
      </div>
    </Card.Body>
  );
}
