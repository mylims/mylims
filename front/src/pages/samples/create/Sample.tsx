import React from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import {
  Alert,
  AlertType,
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
      <InputFieldRHF name="sampleCode.0" label="Wafer name" required disabled />
      <InputFieldRHF name="sampleCode.1" label="Sample name" required />
      <InputFieldRHF name="project" label="Project" />
      <InputFieldRHF name="meta.purpose" label="Purpose" />
      <InputFieldRHF name="meta.labelPurpose" label="Label purpose" />
      <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
      <ToggleFieldRHF name="meta.reserved" label="Reserved" />
    </DefaultCreate>
  );
}

SampleCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new sample">{page}</ElnLayout>
);
