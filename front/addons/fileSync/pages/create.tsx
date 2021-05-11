import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import ElnLayout from '../../../components/ElnLayout';
import {
  NewFileSyncOptionInput,
  useCreateFileSyncOptionMutation,
} from '../../../generated/graphql';
import FileSyncConfigForm from '../FileSyncConfigForm';

export default function CreateConfig() {
  const [createFileSyncOption, { loading }] = useCreateFileSyncOptionMutation();
  const router = useRouter();

  const onSubmit = useMemo(
    () => async (
      values: NewFileSyncOptionInput,
      { resetForm }: FormikHelpers<NewFileSyncOptionInput>,
    ) => {
      await createFileSyncOption({ variables: { input: values } });
      resetForm();
      router.push('list').catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    },
    [createFileSyncOption, router],
  );

  return (
    <>
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
