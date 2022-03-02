import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, AlertType, Card, Spinner } from '@/components/tailwind-ui';
import { SampleQuery, useSampleQuery } from '@/generated/graphql';

interface SampleDetailProps {
  children(sample: SampleQuery['sample']): ReactNode;
}
export default function SampleDetail({ children }: SampleDetailProps) {
  const { id = '' } = useParams<{ id: string }>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  const { sample } = data;
  return (
    <Card>
      <Card.Body>{children(sample)}</Card.Body>
    </Card>
  );
}
