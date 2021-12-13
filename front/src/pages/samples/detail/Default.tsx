import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, AlertType, Card, Spinner } from '@/components/tailwind-ui';
import { SampleQuery, useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

interface SampleDetailProps {
  children(sample: SampleQuery['sample']): ReactNode;
}
export default function SampleDetail({ children }: SampleDetailProps) {
  const { id = '' } = useParams<{ id: string }>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching measurement" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  const { sample } = data;
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-semibold">
              Code: {sample.sampleCode.join('_')}
            </div>
            <div className="text-neutral-500">
              Created at {formatDate(sample.createdAt)}
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{children(sample)}</Card.Body>
    </Card>
  );
}
