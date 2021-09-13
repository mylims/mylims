import { FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import FileSyncConfigForm from '../FileSyncConfigForm';
import {
  NewFileSyncOptionInput,
  useCreateFileSyncOptionMutation,
} from '../generated/graphql';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType } from '@/components/tailwind-ui';


export default function CreateConfig() {
  const [createFileSyncOption, { loading, error }] =
    useCreateFileSyncOptionMutation();
  const router = useHistory();

  const onSubmit = useMemo(
    () =>
      async (
        values: NewFileSyncOptionInput,
        { resetForm }: FormikHelpers<NewFileSyncOptionInput>,
      ) => {
        await createFileSyncOption({ variables: { input: values } });
        resetForm();
        router.push('list');
      },
    [createFileSyncOption, router],
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
