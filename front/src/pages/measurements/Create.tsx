import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { array } from 'yup';

import ElnLayout from '@/components/ElnLayout';
import { LexicalEditorRHF } from '@/components/LexicalEditor/LexicalEditorRHF';
import { PlotSingleRHF } from '@/components/PlotSingleRHF';
import {
  Alert,
  Select,
  Spinner,
  FormRHF,
  AlertType,
  InputFieldRHF,
  optionalString,
  requiredObject,
  requiredString,
  SubmitButtonRHF,
  DropzoneFieldRHF,
} from '@/components/tailwind-ui';
import {
  MeasurementInput,
  MeasurementTypes,
  useCreateMeasurementMutation,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';
import { useElnMultipartMutation } from '@/hooks/useElnQuery';
import { measurementTypeList } from '@/models/measurements';

type MeasurementInputForm = Omit<MeasurementInput, 'userId' | 'sampleId'> & {
  attachments: string[];
  jcamp?: string;
};

export default function CreateMeasurement() {
  const navigate = useNavigate();
  const { mutateAsync } = useElnMultipartMutation('/files/create');
  const { id: userId } = useAuth();
  const { id: sampleId = '' } = useParams<{ id: string }>();
  const [type, setType] = useState(MeasurementTypes.TRANSFER);

  const [authError, setError] = useState<Error | null>(null);
  const [createMeasurement, { loading, error }] =
    useCreateMeasurementMutation();
  const initialMeasurement: MeasurementInputForm = { attachments: [] };

  const measurementSchema = requiredObject({
    sampleCode: array().of(requiredString()),
    comment: optionalString(),
    description: array(),
  });

  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !sampleId || !userId || authError) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        {!userId && `Missing user id`}
        {!sampleId && `Missing sample id`}
        {authError && `Error: ${authError.message}`}
        {error && `Unexpected error: ${error.message}`}
      </Alert>
    );
  }

  async function onSubmit({
    attachments,
    jcamp,
    ...data
  }: MeasurementInputForm) {
    try {
      let file: string | undefined;
      if (jcamp) {
        const blob = new Blob([jcamp], { type: 'text/plain' });
        const res = await mutateAsync({ file: blob, collection: type });
        if (!res._id) throw new Error('Failed to upload file');
        file = res._id;
      }
      if (!userId) throw new Error('Missing user id');

      let input: MeasurementInput = {
        ...data,
        userId,
        fileId: file,
      };
      const { errors, data: res } = await createMeasurement({
        variables: { input, sampleId, type },
      });
      if (errors) {
        setError(new Error(errors[0].message));
      } else if (!res) {
        setError(new Error('Error during sample creation'));
      } else {
        navigate(`/measurement/detail/${type}/${res.createMeasurement.id}`);
      }
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <FormRHF<MeasurementInputForm>
      defaultValues={initialMeasurement}
      onSubmit={onSubmit}
      validationSchema={measurementSchema}
    >
      <div style={{ width: '90vw' }}>
        <div className="hidden md:flex md:flex-row md:justify-end">
          <SubmitButtonRHF disabled={loading}>Submit</SubmitButtonRHF>
        </div>
        <div className="my-4 flex flex-col lg:w-full lg:flex-row lg:gap-4">
          <div className="lg:w-1/3">
            <div className="grid-cols-auto mb-4 grid items-end gap-4">
              <Select
                // @ts-expect-error (X | Y)[] == X[] | Y[]
                options={measurementTypeList}
                selected={type}
                label="Measurement type"
                required
                onSelect={(selected?: MeasurementTypes) => {
                  setType(selected ?? MeasurementTypes.TRANSFER);
                }}
              />
              <InputFieldRHF name="title" label="Title" required />
              <InputFieldRHF name="comment" label="Comment" />
            </div>
            <div>
              <DropzoneFieldRHF
                label="Attachments"
                name="attachments"
                maxFiles={1}
                showList
              />
            </div>
          </div>
          <div className="rounded-md border border-neutral-300 p-4 shadow-sm lg:w-1/3">
            <PlotSingleRHF name="attachments" type={type} />
          </div>
          <div className="lg:w-1/3">
            <LexicalEditorRHF name="description" label="Description" />
          </div>
        </div>
        <div className="mt-2 flex flex-row justify-end md:hidden">
          <SubmitButtonRHF disabled={loading}>Submit</SubmitButtonRHF>
        </div>
      </div>
    </FormRHF>
  );
}

CreateMeasurement.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new measurement">{page}</ElnLayout>
);
