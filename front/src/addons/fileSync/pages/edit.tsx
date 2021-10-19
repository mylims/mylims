import { FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import FileSyncConfigForm from '../FileSyncConfigForm';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType, Spinner } from '@/components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
  useEditFileSyncOptionMutation,
  useFileSyncOptionQuery,
} from '@/generated/graphql';

export default function EditConfig() {
  const [editFileSyncOption, { loading: mutationLoading }] =
    useEditFileSyncOptionMutation();
  const router = useHistory();
  const { id } = useParams<{ id: string }>();
  const {
    data,
    loading: queryLoading,
    error,
  } = useFileSyncOptionQuery({
    variables: { id },
  });

  const onSubmit = useMemo(
    () =>
      async (
        values: EditFileSyncOptionInput | NewFileSyncOptionInput,
        {
          resetForm,
        }: FormikHelpers<EditFileSyncOptionInput | NewFileSyncOptionInput>,
      ) => {
        await editFileSyncOption({
          variables: { input: { ...values, id } },
        });
        resetForm();
        router.push('../list');
      },
    [editFileSyncOption, router, id],
  );

  if (id === undefined) {
    void router.push('list');
    return null;
  }

  return (
    <div>
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
        <>
          <FileSyncConfigForm
            title="Edit synchronization"
            submitLabel="Save"
            initialValues={data?.fileSyncOption}
            onSubmit={onSubmit}
            loading={mutationLoading}
          >
            <div>
              <span className="font-medium">Synchronization Id: </span>
              <span className="text-neutral-500">{id}</span>
            </div>
          </FileSyncConfigForm>
        </>
      )}
    </div>
  );
}
EditConfig.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="File synchronization: edit">{page}</ElnLayout>
);
