import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import ElnLayout from '../../../../components/ElnLayout';
import { Alert, AlertType, Spinner } from '../../../../components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  useEditFileSyncOptionMutation,
  useFileSyncOptionQuery,
} from '../../../../generated/graphql';
import FileSyncConfigForm from '../../FileSyncConfigForm';

export default function EditConfig() {
  const [editFileSyncOption, { loading }] = useEditFileSyncOptionMutation();
  const router = useRouter();
  const { id } = router.query;
  const { data, loading: queryLoading, error } = useFileSyncOptionQuery({
    variables: { id: id as string },
  });

  const onSubmit = useMemo(
    () => async (
      values: EditFileSyncOptionInput,
      { resetForm }: FormikHelpers<EditFileSyncOptionInput>,
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
      {error && (
        <Alert
          title={'Error while fetching file sync option'}
          type={AlertType.ERROR}
        >
          Unexpected error {error}
        </Alert>
      )}
      {queryLoading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <FileSyncConfigForm
          title="Edit synchronisation"
          submitLabel="Save"
          initialValues={data?.fileSyncOption}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}
    </>
  );
}
EditConfig.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="File synchronization: edit">{page}</ElnLayout>
);
