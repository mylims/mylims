import React, { useEffect, useState } from 'react';
import { Alert, AlertType, Card } from '@/components/tailwind-ui';

import { Annotation } from 'react-plot';
import { PlotJcamp } from '@/components/PlotJcamp';

interface B1505TransferProps {
  file: null | { filename: string; downloadUrl: string; size: number };
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

interface B1505TransferState {
  content: string | null;
  error: Error | null;
}

const dashedLine = { strokeWidth: 2, opacity: 0.75, strokeDasharray: '5,5' };
const underline = (color: string) => ({
  textDecoration: 'underline',
  WebkitTextDecorationColor: color,
  textDecorationColor: color,
  textDecorationThickness: '2px',
});

export default function B1505Transfer({ file, derived }: B1505TransferProps) {
  const [{ content, error }, setState] = useState<B1505TransferState>({
    content: null,
    error: null,
  });

  useEffect(() => {
    if (file) {
      fetch(file.downloadUrl)
        .then((res) => res.text())
        .then((data) => setState({ content: data, error: null }))
        .catch((error) => setState({ content: null, error }));
    }
  }, [file?.downloadUrl]);

  if (error) {
    return (
      <Card.Body>
        <Alert
          title="Error while fetching measurement plot"
          type={AlertType.ERROR}
        >
          Unexpected error: {error.message}
        </Alert>
      </Card.Body>
    );
  }
  return (
    <Card.Body>
      <div className="flex justify-around">
        <div>
          <PlotJcamp
            content={content}
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
                const spectrum = analysis.getXYSpectrum(query);
                const { x, y } = spectrum?.variables || {};
                return (
                  <>
                    <Annotation.Line
                      x1={derived.thresholdVoltage.value}
                      x2={derived.thresholdVoltage.value}
                      y1={y.min ?? '0'}
                      y2={y.max ?? '500'}
                      style={{ stroke: 'green', ...dashedLine }}
                    />
                    <Annotation.Circle
                      cx={derived.thresholdVoltage.value}
                      cy={1e-6}
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
                          cx={x.data[derived.subthresholdSlope.fromIndex]}
                          cy={y.data[derived.subthresholdSlope.fromIndex]}
                          r="4"
                          style={{ fill: 'blue' }}
                        />
                        <Annotation.Circle
                          cx={x.data[derived.subthresholdSlope.toIndex]}
                          cy={y.data[derived.subthresholdSlope.toIndex]}
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
          </PlotJcamp>
        </div>
        <div>
          <div>
            <div className="font-medium" style={underline('green')}>
              Threshold Voltage
            </div>
            <div className="text-neutral-400">
              {derived.thresholdVoltage.value} V
            </div>
          </div>
          <div>
            <div className="font-medium" style={underline('blue')}>
              Subthreshold slope
            </div>
            <div className="text-neutral-400">
              {derived.subthresholdSlope.medianSlope * 1000} mV/dec
            </div>
          </div>
        </div>
      </div>
    </Card.Body>
  );
}
