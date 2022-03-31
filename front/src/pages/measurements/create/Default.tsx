import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { array } from 'yup';

import ElnLayout from '@/components/ElnLayout';
import { FormLayout } from '@/components/FormLayout';
import { RichTextImageFieldRHF } from '@/components/RichTextImageFieldRHF';
import {
  Spinner,
  Alert,
  AlertType,
  FormRHF,
  SubmitButtonRHF,
  optionalString,
  requiredObject,
  requiredString,
  Select,
  InputFieldRHF,
} from '@/components/tailwind-ui';
import {
  MeasurementInput,
  MeasurementTypes,
  useCreateMeasurementMutation,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';
import { useElnMultipartMutation } from '@/hooks/useElnQuery';

type MeasurementInputForm = Omit<MeasurementInput, 'userId' | 'sampleId'>;
export default function CreateMeasurement() {
  const navigate = useNavigate();
  const { mutateAsync } = useElnMultipartMutation('/files/create');
  const { id: userId } = useAuth();
  const { id: sampleId = '' } = useParams<{ id: string }>();
  const [type, setType] = useState(MeasurementTypes.TRANSFER);

  const [authError, setError] = useState<Error | null>(null);
  const [createMeasurement, { loading, error }] =
    useCreateMeasurementMutation();
  const initialMeasurement: MeasurementInputForm = {};

  const measurementSchema = requiredObject({
    sampleCode: array().of(requiredString()),
    comment: optionalString(),
    description: array(),
  });

  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !sampleId || !userId || authError) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        {error && `Unexpected error: ${error.message}`}
        {authError && `Error: ${authError.message}`}
        {!sampleId && `Missing sample id`}
        {!userId && `Missing user id`}
      </Alert>
    );
  }

  async function onSubmit({ fileId, ...data }: MeasurementInputForm) {
    try {
      let file: string | undefined;
      if (fileId) {
        const res = await mutateAsync({ fileId, collection: 'measurements' });
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
        navigate(`/measurement/detail/${res.createMeasurement.id}`);
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

        <FormLayout
          formGrid={
            <>
              <Select
                options={[MeasurementTypes.TRANSFER]}
                selected={type}
                onSelect={(selected?: MeasurementTypes) => {
                  setType(selected ?? MeasurementTypes.TRANSFER);
                }}
                label="Measurement type"
                required
              />
              <InputFieldRHF name="title" label="Title" required />
              <InputFieldRHF name="comment" label="Comment" />
            </>
          }
          formAttachments={<></>}
          formEditor={
            <div>
              <RichTextImageFieldRHF name="description" label="Description" />
            </div>
          }
        />
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
