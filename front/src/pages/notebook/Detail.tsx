import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { Spinner, Alert, AlertType } from '@/components/tailwind-ui';
import {
  UpdateNotebookMutation,
  useNotebookQuery,
  useUpdateNotebookMutation,
} from '@/generated/graphql';
import { notebookInputToState } from '@/pages/notebook/adapters';
import { useSubmitNotebook } from '@/pages/notebook/hooks/useSubmitNotebook';

import { NotebookForm } from './components/NotebookForm';

export default function NotebookDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [updateNotebook, { loading: updateLoading, error: updateError }] =
    useUpdateNotebookMutation();

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useNotebookQuery({ variables: { id } });

  const notebook = useMemo(() => {
    return notebookInputToState(data?.notebook);
  }, [data]);

  const { onSubmit, error: authError } =
    useSubmitNotebook<UpdateNotebookMutation>({
      async submissionFunc(input) {
        return updateNotebook({ variables: { id, input } });
      },
      onSuccess(res) {
        navigate(`/notebook/detail/${res.updateNotebook.id}`);
      },
    });

  if (queryLoading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (updateError || queryError || !notebook) {
    return (
      <Alert title="Error while fetching notebook" type={AlertType.ERROR}>
        {authError ? `Failed to get auth status : ${authError.message}` : null}
        {updateError ? `Failed to save : ${updateError.message}` : null}
        {queryError ? `Failed to get notebook: ${queryError.message}` : null}
      </Alert>
    );
  }

  return (
    <NotebookForm
      loading={updateLoading}
      onSubmit={onSubmit}
      initialValue={notebook}
    />
  );
}

NotebookDetail.getLayout = (page: React.ReactNode) => (
  <ElnLayout maxWidth="w-full">{page}</ElnLayout>
);
