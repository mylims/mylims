import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import {
  Alert,
  AlertType,
  Button,
  Card,
  Spinner,
  Variant,
} from '@/components/tailwind-ui';
import { MeasurementTypes, useMeasurementQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

import B1505Transfer from './B1505Transfer';

export default function MeasurementDetail() {
  const { id = '', type = MeasurementTypes.TRANSFER } =
    useParams<{ id: string; type: MeasurementTypes }>();
  const { data, loading, error } = useMeasurementQuery({
    variables: { id, type },
  });
  const measurementBody = useMemo(() => {
    switch (data?.measurement.type) {
      case 'transfer': {
        return (
          <B1505Transfer
            fileId={data.measurement.fileId ?? null}
            file={data.measurement.file ?? null}
            derived={data.measurement.derived}
          />
        );
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
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-semibold">Measurement</div>
            <div className="text-neutral-500">{id}</div>
          </div>

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
      </Card.Header>
      {measurementBody}
      <Card.Footer>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <FieldDescription title="Sample code">
            {measurement.sampleCode.join(',')}
          </FieldDescription>
          <FieldDescription title="Owner's username">
            {measurement.username}
          </FieldDescription>
          <FieldDescription title="Creation date">
            {formatDate(measurement.createdAt)}
          </FieldDescription>
          <FieldDescription title="Created by">
            {measurement.createdBy}
          </FieldDescription>
          {measurement.file && (
            <FieldDescription title="File">
              {measurement.file.filename}
            </FieldDescription>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}

MeasurementDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Measurement detail">{page}</ElnLayout>;
};
