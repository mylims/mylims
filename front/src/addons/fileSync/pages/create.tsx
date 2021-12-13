import { FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import FileSyncConfigForm from '../FileSyncConfigForm';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType } from '@/components/tailwind-ui';
import {
  NewFileSyncOptionInput,
  useCreateFileSyncOptionMutation,
} from '@/generated/graphql';

export default function CreateConfig() {
  const [createFileSyncOption, { loading, error }] =
    useCreateFileSyncOptionMutation();
  const navigate = useNavigate();

  const onSubmit = useMemo(
    () =>
      async (
        values: NewFileSyncOptionInput,
        { resetForm }: FormikHelpers<NewFileSyncOptionInput>,
      ) => {
        await createFileSyncOption({ variables: { input: values } });
        resetForm();
        navigate('../list');
      },
    [createFileSyncOption, navigate],
  );

  return (
    <>
      {error && (
        <Alert
          title={'Error while creating a new file sync option'}
          type={AlertType.ERROR}
        >
          Unexpected error: {error}
        </Alert>
      )}
      <FileSyncConfigForm
        title="New file synchronisation"
        submitLabel="Create"
        loading={loading}
        onSubmit={onSubmit}
      />
    </>
  );
}
CreateConfig.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="File synchronization: create">{page}</ElnLayout>
);
