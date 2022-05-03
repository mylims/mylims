import React from 'react';
import { useNavigate } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType } from '@/components/tailwind-ui';
import {
  CreateNotebookMutation,
  useCreateNotebookMutation,
} from '@/generated/graphql';

import { NotebookForm } from './components/NotebookForm';
import { useSubmitNotebook } from './hooks/useSubmitNotebook';
import { defaultNotebook } from './models';

export default function NotebookCreate() {
  const navigate = useNavigate();

  const [createNotebook, { loading: createLoading, error: createError }] =
    useCreateNotebookMutation();

  const { onSubmit, error: authError } =
    useSubmitNotebook<CreateNotebookMutation>({
      async submissionFunc(input) {
        return createNotebook({ variables: { input } });
      },
      onSuccess(res) {
        navigate(`/notebook/detail/${res.createNotebook.id}`);
      },
    });

  if (createError) {
    return (
      <Alert title="Error while fetching notebook" type={AlertType.ERROR}>
        {authError ? `Failed to get auth status : ${authError.message}` : null}
        {createError ? `Failed to save : ${createError.message}` : null}
      </Alert>
    );
  }

  return (
    <NotebookForm
      loading={createLoading}
      onSubmit={onSubmit}
      initialValue={defaultNotebook}
    />
  );
}

NotebookCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout maxWidth="w-full">{page}</ElnLayout>
);
