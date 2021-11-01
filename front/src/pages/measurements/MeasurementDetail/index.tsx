import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType, Card, Spinner } from '@/components/tailwind-ui';
import { useMeasurementQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';
import B1505Transfer from './B1505Transfer';

export default function MeasurementDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useMeasurementQuery({ variables: { id } });
  const measurementBody = useMemo(() => {
    switch (data?.measurement.__typename) {
      case 'TransferMeasurement': {
        return (
          <B1505Transfer
            file={data.measurement.file ?? null}
            derived={data.measurement.transferDerived}
          />
        );
      }
      default: {
        return null;
      }
    }
  }, [data?.measurement.__typename]);

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
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
        <div className="text-xl font-semibold">Measurement</div>
        <div className="text-neutral-500">{id}</div>
      </Card.Header>
      {measurementBody}
      <Card.Footer>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MeasurementField
            title="Sample code"
            description={measurement.sampleCode.join(',')}
          />
          <MeasurementField
            title="Owner's username"
            description={measurement.username}
          />
          <MeasurementField
            title="Creation date"
            description={formatDate(measurement.createdAt)}
          />
          <MeasurementField
            title="Created by"
            description={measurement.createdBy}
          />
          {measurement.file && (
            <MeasurementField
              title="File"
              description={measurement.file.filename}
            />
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}

function MeasurementField({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-neutral-400">{description}</div>
    </div>
  );
}

MeasurementDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Measurement detail">{page}</ElnLayout>;
};
