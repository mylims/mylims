import { PaperClipIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import MeasuresTable from '@/components/MeasuresTable';
import { RichTextImageFieldRHF } from '@/components/RichTextImageFieldRHF';
import {
  Spinner,
  Alert,
  AlertType,
  Card,
  FormRHF,
  SubmitButtonRHF,
  InputFieldRHF,
} from '@/components/tailwind-ui';
import {
  NotebookInput,
  NotebookQuery,
  useNotebookQuery,
  useUpdateNotebookMutation,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatFields';

type Notebook = NotebookQuery['notebook'];
export default function NotebookDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { id: userId } = useAuth();
  const navigate = useNavigate();
  const [authError, setError] = useState<Error | null>(null);
  const [updateNotebook, { loading: updateLoading, error: updateError }] =
    useUpdateNotebookMutation();

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useNotebookQuery({ variables: { id } });

  if (queryLoading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (updateError || queryError || !data) {
    return (
      <Alert title="Error while fetching notebook" type={AlertType.ERROR}>
        {authError ? `Failed to get auth status : ${authError.message}` : null}
        {updateError ? `Failed to save : ${updateError.message}` : null}
        {queryError ? `Failed to get notebook: ${queryError.message}` : null}
      </Alert>
    );
  }
  const { notebook } = data;

  async function onSubmit(data: Notebook) {
    if (userId) {
      try {
        const input: NotebookInput = {
          title: data.title,
          description: data.description,
          labels: data.labels,
          project: data.project,
          content: data.content,
          userId,
          samples: data.samples.map(({ id }) => id),
          measurements: data.measurements.map(({ id, type }) => ({ id, type })),
        };
        const { errors, data: res } = await updateNotebook({
          variables: { id, input },
        });
        if (errors) {
          setError(new Error(errors[0].message));
        } else if (!res) {
          setError(new Error('Error during sample update'));
        } else {
          navigate(`/notebook/detail/${res.updateNotebook.id}`);
        }
      } catch (error) {
        setError(error as Error);
      }
    } else {
      setError(new Error('Not authenticated'));
    }
  }

  return (
    <FormRHF<Notebook> defaultValues={notebook} onSubmit={onSubmit}>
      <Card>
        <Card.Header>
          <div className="flex flex-row justify-between">
            <InputFieldRHF
              name="title"
              label="Notebook title"
              className="uppercase"
            />
            <div className="flex flex-row gap-4">
              <FieldDescription title="Created at">
                {formatDate(notebook.createdAt)}
              </FieldDescription>
              <SubmitButtonRHF disabled={updateLoading} className="flex">
                <PaperClipIcon className="h-5 w-5" />
                <span>Save</span>
              </SubmitButtonRHF>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="my-4 flex flex-col lg:w-full lg:flex-row lg:gap-4">
            <div className="lg:w-1/3">
              <div className="grid-cols-auto mb-4 grid items-end gap-4">
                <InputFieldRHF name="project" label="Project" />
                <MultiSelect name="labels" label="Labels" />
              </div>
              <InputFieldRHF name="description" label="Description" />
              <div className="mt-2 flex flex-row gap-4">
                <div className="text-xl font-semibold">Measurements</div>
              </div>
              <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                <MeasuresTable measurements={notebook.measurements} />
              </div>
            </div>
            <div className="lg:w-2/3">
              <RichTextImageFieldRHF name="content" label="Content" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </FormRHF>
  );
}

NotebookDetail.getLayout = (page: React.ReactNode) => (
  <ElnLayout maxWidth="w-full">{page}</ElnLayout>
);
