import { FormikHelpers } from 'formik';
import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';

import ElnLayout from '@components/ElnLayout';
import { Alert, AlertType } from '@components/tailwind-ui';
import FileSyncConfigForm from '../FileSyncConfigForm';
import {
  NewFileSyncOptionInput,
  useCreateFileSyncOptionMutation,
} from '../generated/graphql';

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
        await router.push('list');
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
