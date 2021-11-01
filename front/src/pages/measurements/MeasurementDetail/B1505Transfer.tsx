import React, { useEffect, useState } from 'react';
import { Alert, AlertType, Card } from '@/components/tailwind-ui';

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
      <div>
        <div className="font-medium">File</div>
        <div className="text-neutral-400">{file?.filename}</div>
      </div>
      <div>
        <div className="font-medium">Threshold Voltage</div>
        <div className="text-neutral-400">
          {derived.thresholdVoltage.value} V
        </div>
      </div>
      <div>
        <div className="font-medium">Subthreshold resistance</div>
        <div className="text-neutral-400">
          {derived.subthresholdSlope.medianSlope} Ohm
        </div>
      </div>
      <div className="truncate">{content}</div>
    </Card.Body>
  );
}
