import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import ElnLayout from '../../../../components/ElnLayout';
import { Alert, AlertType, Spinner } from '../../../../components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
  useEditFileSyncOptionMutation,
  useFileSyncOptionQuery,
} from '../../../../generated/graphql';
import FileSyncConfigForm from '../../FileSyncConfigForm';

export default function EditConfig() {
  const [
    editFileSyncOption,
    { loading: mutationLoading },
  ] = useEditFileSyncOptionMutation();
  const router = useRouter();
  const { id } = router.query;
  const { data, loading: queryLoading, error } = useFileSyncOptionQuery({
    variables: { id: id as string },
  });

  const onSubmit = useMemo(
    () => async (
      values: EditFileSyncOptionInput | NewFileSyncOptionInput,
      {
        resetForm,
      }: FormikHelpers<EditFileSyncOptionInput | NewFileSyncOptionInput>,
    ) => {
      await editFileSyncOption({
        variables: { input: { ...values, id: id as string } },
      });
      resetForm();
      router.push('../list').catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    },
    [editFileSyncOption, router, id],
  );

  if (id === undefined) {
    router.push('list').catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
    return null;
  }

  return (
    <>
      {queryLoading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : error ? (
        <Alert
          title={'Error while fetching file sync option'}
          type={AlertType.ERROR}
        >
          Unexpected error {error.message}
        </Alert>
      ) : (
        <FileSyncConfigForm
          title="Edit synchronisation"
          submitLabel="Save"
          initialValues={data?.fileSyncOption}
          onSubmit={onSubmit}
          loading={mutationLoading}
        />
      )}
    </>
  );
}
EditConfig.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="File synchronization: edit">{page}</ElnLayout>
);
