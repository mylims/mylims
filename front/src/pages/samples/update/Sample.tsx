import React from 'react';
import { boolean } from 'yup';

import ElnLayout from '@/components/ElnLayout';
import {
  InputFieldRHF,
  optionalString,
  ToggleFieldRHF,
} from '@/components/tailwind-ui';

import DefaultUpdate from './Default';

const sampleUpdateSchema = {
  purpose: optionalString(),
  labelPurpose: optionalString(),
  reserved: boolean(),
  heterostructure: optionalString(),
};

export default function SampleUpdate() {
  return (
    <DefaultUpdate codeLength={2} kind="sample" metaSchema={sampleUpdateSchema}>
      <InputFieldRHF name="project" label="Project" />
      <InputFieldRHF name="meta.purpose" label="Purpose" />
      <ToggleFieldRHF name="meta.reserved" label="Reserved" />
      <InputFieldRHF name="meta.labelPurpose" label="Label purpose" />
      <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
    </DefaultUpdate>
  );
}

SampleUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update sample">{page}</ElnLayout>
);
