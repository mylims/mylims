import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { LinkButton } from '@/components/LinkButton';
import {
  Alert,
  AlertType,
  Button,
  Card,
  Spinner,
  Variant,
} from '@/components/tailwind-ui';
import { MeasurementTypes, useMeasurementQuery } from '@/generated/graphql';

import B1505Transfer from './B1505Transfer';

const SAMPLE_LEVEL = ['wafer', 'sample', 'dye', 'device'];

export default function MeasurementDetail() {
  const { id = '', type = MeasurementTypes.TRANSFER } =
    useParams<{ id: string; type: MeasurementTypes }>();
  const { data, loading, error } = useMeasurementQuery({
    variables: { id, type },
  });
  const measurementBody = useMemo(() => {
    if (!data) return null;
    switch (data.measurement.type) {
      case 'transfer': {
        return <B1505Transfer {...data.measurement} />;
      }
      default: {
        return null;
      }
    }
  }, [data?.measurement]);

  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching measurement" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }

  const { measurement } = data;
  const sampleType = SAMPLE_LEVEL[measurement.sample.sampleCode.length - 1];
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-semibold">
              Measurement {measurement.type}
            </div>
            {measurement.title && (
              <div className="text-neutral-500">{measurement.title}</div>
            )}
          </div>

          <div className="flex flex-row gap-2">
            <LinkButton
              to={`/sample/detail/${sampleType}/${measurement.sample.id}`}
            >
              Sample detail
            </LinkButton>
            {measurement.file?.downloadUrl && (
              <div>
                <a
                  href={measurement.file.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant={Variant.secondary}>Download file</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </Card.Header>
      {measurementBody}
    </Card>
  );
}

MeasurementDetail.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
