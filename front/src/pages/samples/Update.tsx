import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { array } from 'yup';

import AttachmentsTableRHF from '@/components/AttachmentsTableRHF';
import ElnLayout from '@/components/ElnLayout';
import { FormLayout } from '@/components/FormLayout';
import { LexicalEditorRHF } from '@/components/LexicalEditor/LexicalEditorRHF';
import {
  Alert,
  AlertType,
  DropzoneFieldRHF,
  FormRHF,
  optionalString,
  requiredObject,
  requiredString,
  Spinner,
  SubmitButtonRHF,
} from '@/components/tailwind-ui';
import {
  SampleInput,
  SampleQuery,
  useSampleQuery,
  useUpdateSampleMutation,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';
import { useElnMultipartMutation } from '@/hooks/useElnQuery';
import { SampleParams, SamplesMap } from '@/pages/samples/models/BaseSample';

type SampleInputForm = Omit<SampleInput, 'kind' | 'userId'> & {
  userId?: string;
  prevAttachments: SampleQuery['sample']['attachments'];
};

export default function SamplesUpdate() {
  const { id = '', kind = 'wafer' } = useParams<SampleParams>();
  const Sample = useMemo(() => SamplesMap[kind], [kind]);
  const { id: userId } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync } = useElnMultipartMutation('/files/create');
  const [authError, setError] = useState<Error | null>(null);

  const [updateSample, { loading: updateLoading, error: updateError }] =
    useUpdateSampleMutation();

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useSampleQuery({ variables: { id } });

  async function onSubmit({
    attachments,
    prevAttachments,
    ...data
  }: SampleInputForm) {
    if (userId) {
      try {
        let files: string[] = prevAttachments.map(({ id }) => id);
        for (const file of attachments) {
          const res = await mutateAsync({ file, collection: 'samples' });
          if (!res._id) throw new Error('Failed to upload file');
          files.push(res._id);
        }
        const input = {
          ...data,
          userId: data.userId ?? userId,
          kind,
          attachments: files,
        };
        const { errors, data: res } = await updateSample({
          variables: { id, input },
        });
        if (errors) {
          setError(new Error(errors[0].message));
        } else if (!res) {
          setError(new Error('Error during sample update'));
        } else {
          navigate(`/sample/detail/${kind}/${res.updateSample.id}`);
        }
      } catch (error) {
        setError(error as Error);
      }
    } else {
      setError(new Error('Not authenticated'));
    }
  }

  if (queryLoading) return <Spinner className="h-10 w-10 text-danger-500" />;

  if (authError || updateError || queryError || !data || !Sample) {
    return (
      <Alert title="Error" type={AlertType.ERROR}>
        {authError ? `Failed to get auth status : ${authError.message}` : null}
        {updateError
          ? `Failed to get form structure : ${updateError.message}`
          : null}
        {queryError ? `Failed to get sample: ${queryError.message}` : null}
        {!Sample ? `Unknown sample kind: ${kind}` : null}
      </Alert>
    );
  }

  const waferCreateSchema = requiredObject({
    sampleCode: array()
      .of(requiredString())
      .min(Sample.codeLength, 'Required at least one sample code'),
    project: optionalString(),
    title: optionalString(),
    comment: optionalString(),
    description: array(),
    labels: array().of(requiredString()),
    meta: requiredObject(Sample.updateSchema),
  });

  const defaultValues = parseInputForm(data.sample);
  return (
    <FormRHF<SampleInputForm>
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      validationSchema={waferCreateSchema}
    >
      <div style={{ width: '90vw' }}>
        <div className="hidden md:flex md:flex-row md:justify-end">
          <SubmitButtonRHF disabled={updateLoading}>Submit</SubmitButtonRHF>
        </div>
        <FormLayout
          formGrid={Sample.updateForm}
          formAttachments={
            <>
              <DropzoneFieldRHF
                label="Attachments"
                name="attachments"
                showList
              />
              <AttachmentsTableRHF name="prevAttachments" className="mt-2" />
            </>
          }
          formEditor={
            <LexicalEditorRHF name="description" label="Description" />
          }
        />
        <div className="mt-2 flex flex-row justify-end md:hidden">
          <SubmitButtonRHF disabled={updateLoading}>Submit</SubmitButtonRHF>
        </div>
      </div>
    </FormRHF>
  );
}

function parseInputForm(sample: SampleQuery['sample']): SampleInputForm {
  const {
    uuid10,
    attachments,
    createdAt,
    measurements,
    children,
    user,
    __typename,
    id,
    ...plainFields
  } = sample;

  return {
    ...plainFields,
    attachments: [],
    prevAttachments: attachments,
    userId: user?.id,
  };
}

SamplesUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
