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
import { useElnMultipartMutation } from '@/hooks/useElnQuery';

export default function WaferCreate() {
  const { id } = useAuth();
  const authMutation = useElnMultipartMutation('/files/create');
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
        onSubmit={async ({ attachments, ...input }) => {
          if (id) {
            try {
              let files: string[] = [];
              for (const file of attachments) {
                const res = await authMutation.mutateAsync({
                  file,
                  collection: 'samples',
                });
                if (res._id) {
                  files.push(res._id);
                } else {
                  throw new Error('Failed to upload file');
                }
              }
              console.log(input, attachments, files);
              // await createSample({
              //   variables: {
              //     input: { ...input, userId: id, kind: 'wafer', attachments: files } as SampleInput,
              //   },
              // });
            } catch (error) {
              setError(error as Error);
            }
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
