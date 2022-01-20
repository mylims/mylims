import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import { FormSchema } from '@/components/FormSchema';
import { Alert, AlertType, Spinner } from '@/components/tailwind-ui';
import {
  useSampleKindQuery,
  useCreateSampleMutation,
  SampleInput,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';

export default function WaferCreate() {
  const { id } = useAuth();
  const [authError, setError] = useState<Error | null>(null);
  const { data, loading, error } = useSampleKindQuery({
    variables: { id: 'wafer' },
  });
  const [createSample, { loading: mutationLoading, error: mutationError }] =
    useCreateSampleMutation();

  if (loading || mutationLoading) {
    return <Spinner className="w-10 h-10 text-danger-500" />;
  }
  if (authError || error || mutationError || !data) {
    return (
      <Alert title="Error" type={AlertType.ERROR}>
        {authError && `Failed to get auth status : ${authError.message}`}
        {error && `Failed to get form structure : ${error.message}`}
        {mutationError && `Failed on creation : ${mutationError.message}`}
        {!data && 'Failed to get form structure'}
      </Alert>
    );
  }
  return (
    <div>
      <FormSchema
        schema={data.sampleKind.schema}
        data={{ attachments: [], labels: [] }}
        onSubmit={({ attachments, ...input }) => {
          if (id) {
            return createSample({
              variables: {
                input: { ...input, userId: id, kind: 'wafer' } as SampleInput,
              },
            });
          } else {
            setError(new Error('Not authenticated'));
          }
        }}
      />
    </div>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
