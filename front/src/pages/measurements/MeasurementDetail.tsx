import React from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { useMeasurementQuery } from '@/generated/graphql';
import { Alert, AlertType, Card, Spinner } from '@/components/tailwind-ui';
import { formatDate } from '@/utils/formatFields';

export default function MeasurementDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useMeasurementQuery({ variables: { id } });

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title={'Error while fetching user'} type={AlertType.ERROR}>
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
      <Card.Body>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MeasurementField title="Topic" description={measurement.username} />
          <MeasurementField
            title="Creation date"
            description={formatDate(measurement.createdAt)}
          />
          <MeasurementField
            title="Relative path"
            description={measurement.sampleCode.join('/')}
          />
        </div>
      </Card.Body>
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
