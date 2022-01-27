import React, { ReactNode, useState } from 'react';

import {
  Alert,
  AlertType,
  FormRHF,
  optionalString,
  requiredObject,
  requiredString,
  SubmitButtonRHF,
} from '@/components/tailwind-ui';
import { useCreateSampleMutation, SampleInput } from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';
import { useElnMultipartMutation } from '@/hooks/useElnQuery';
import { array, BaseSchema } from 'yup';
import { useNavigate } from 'react-router-dom';

type SampleInputForm = Omit<SampleInput, 'userId' | 'kind'>;
interface DefaultCreationProps {
  codeLength: number;
  kind: string;
  metaSchema: Record<string, BaseSchema>;
  children: ReactNode;
}

export default function DefaultCreate({
  codeLength,
  kind,
  metaSchema,
  children,
}: DefaultCreationProps) {
  const { id } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync } = useElnMultipartMutation('/files/create');
  const [authError, setError] = useState<Error | null>(null);
  const [createSample, { loading, error }] = useCreateSampleMutation();
  const initialSample: SampleInputForm = {
    attachments: [],
    labels: [],
    meta: {},
    sampleCode: [],
  };

  const waferCreateSchema = requiredObject({
    sampleCode: array()
      .of(requiredString())
      .min(codeLength, 'Required at least one sample code'),
    project: optionalString(),
    title: optionalString(),
    description: optionalString(),
    labels: array().of(requiredString()),
    meta: requiredObject(metaSchema),
  });

  async function onSubmit({ attachments, ...data }: SampleInputForm) {
    if (id) {
      try {
        let files: string[] = [];
        for (const file of attachments) {
          const res = await mutateAsync({ file, collection: 'samples' });
          if (res._id) throw new Error('Failed to upload file');
          files.push(res._id);
        }
        const input = {
          ...data,
          userId: id,
          kind,
          attachments: files,
        };
        const { errors, data: res } = await createSample({
          variables: { input },
        });
        if (errors) {
          setError(new Error(errors[0].message));
        } else if (!res) {
          setError(new Error('Error during sample creation'));
        } else {
          navigate(`/sample/detail/${kind}/${res.createSample.id}`);
        }
      } catch (error) {
        setError(error as Error);
      }
    } else {
      setError(new Error('Not authenticated'));
    }
  }

  if (authError || error) {
    return (
      <Alert title="Error" type={AlertType.ERROR}>
        {authError && `Failed to get auth status : ${authError.message}`}
        {error && `Failed to get form structure : ${error.message}`}
      </Alert>
    );
  }
  return (
    <FormRHF<SampleInputForm>
      defaultValues={initialSample}
      onSubmit={onSubmit}
      validationSchema={waferCreateSchema}
    >
      <div style={{ width: '90vw' }}>
        <div className="hidden md:flex md:flex-row md:justify-end">
          <SubmitButtonRHF disabled={loading}>Submit</SubmitButtonRHF>
        </div>
        {children}
        <div className="flex flex-row justify-end mt-2 md:hidden">
          <SubmitButtonRHF disabled={loading}>Submit</SubmitButtonRHF>
        </div>
      </div>
    </FormRHF>
  );
}
