import React from 'react';
import { useParams } from 'react-router-dom';

import { API_URL } from '@/../env';
import ElnLayout from '@/components/ElnLayout';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import {
  Alert,
  AlertType,
  DropzoneFieldRHF,
  InputFieldRHF,
  optionalNumber,
  optionalString,
  requiredObject,
  requiredString,
  Spinner,
  ToggleFieldRHF,
} from '@/components/tailwind-ui';
import { useSampleQuery } from '@/generated/graphql';

import DefaultCreate from './Default';

const waferCreateSchema = {
  size: requiredObject({ value: requiredString(), label: requiredString() }),
  purpose: optionalString(),
  heterostructure: optionalString(),
  substrate: optionalString(),
  supplier: optionalString(),
  supplierWaferNumber: optionalString(),
  placeOfGrowth: optionalString(),
  location: optionalString(),
  locationComment: optionalString(),
  rs: optionalNumber(),
  ns: optionalNumber(),
  mobility: optionalNumber(),
};

export default function SampleCreate() {
  const { id = '' } = useParams<{ id: string }>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  const { sample } = data;

  return (
    <DefaultCreate
      codeLength={2}
      kind="wafer"
      metaSchema={waferCreateSchema}
      sampleCode={sample.sampleCode}
      parent={sample.id}
    >
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div className="grid-cols-auto grid items-end gap-4">
            <InputFieldRHF
              name="sampleCode.0"
              label="Wafer name"
              required
              disabled
            />
            <InputFieldRHF name="sampleCode.1" label="Sample name" required />
            <InputFieldRHF name="project" label="Project" />
            <InputFieldRHF name="meta.purpose" label="Purpose" />
            <InputFieldRHF name="meta.labelPurpose" label="Label purpose" />
            <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
            <ToggleFieldRHF name="meta.reserved" label="Reserved" />
          </div>
        </div>
        <div className="col-span-2">
          <DropzoneFieldRHF label="Attachments" name="attachments" showList />
        </div>
        <div className="row-span-2">
          <RichTextFieldRHF
            className="h-full max-w-7xl"
            name="description"
            label="Description"
            fetchImage={(uuid) => `${API_URL}/files/fetchImage/${uuid}`}
            saveImage={async (file) => {
              let body = new FormData();
              body.append('file', file);
              const res = await fetch(`${API_URL}/files/createImage`, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body,
              });
              const [ok, result] = [res.ok, await res.json()];
              if (ok) return result._id;
              else throw new Error(result.errors[0].message);
            }}
          />
        </div>
      </div>
    </DefaultCreate>
  );
}

SampleCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new sample">{page}</ElnLayout>
);
