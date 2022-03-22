import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import WaferDiameterField from '@/components/WaferDiameterField';
import {
  InputFieldRHF,
  optionalNumber,
  optionalString,
  requiredObject,
  requiredString,
} from '@/components/tailwind-ui';

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

export default function WaferCreate() {
  const [defaultCreation, setDefaultCreation] = useState(true);
  return (
    <DefaultCreate
      codeLength={1}
      kind="wafer"
      metaSchema={waferCreateSchema}
      defaultCreation={defaultCreation}
      sampleCode={[]}
      formEditor={
        <WaferDiameterField
          name="meta.size"
          label="Diameter"
          defaultCreation={defaultCreation}
          setDefaultCreation={setDefaultCreation}
          options={['chip', '2 inch', '4 inch', '6 inch'].map((value) => ({
            value,
            label: value,
          }))}
          required
        />
      }
    >
      <InputFieldRHF name="sampleCode.0" label="Wafer name" required />
      <InputFieldRHF name="project" label="Project" />
      <InputFieldRHF name="comment" label="Comment" />
      <MultiSelect name="labels" label="Labels" />
      <InputFieldRHF name="meta.purpose" label="Purpose" />
      <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
      <InputFieldRHF name="meta.substrate" label="Substrate" />
      <InputFieldRHF name="meta.supplier" label="Supplier" />
      <InputFieldRHF
        name="meta.supplierWaferNumber"
        label="Supplier wafer number"
      />
      <InputFieldRHF name="meta.placeOfGrowth" label="Place of growth" />
      <InputFieldRHF name="meta.location" label="Location" />
      <InputFieldRHF name="meta.locationComment" label="Location comment" />
      <InputFieldRHF name="meta.rs" label="Rs (Ohm/sq)" type="number" />
      <InputFieldRHF name="meta.ns" label="Ns (e13/cm^2)" type="number" />
      <InputFieldRHF
        name="meta.mobility"
        label="Mobility (cm^2/Vs)"
        type="number"
      />
    </DefaultCreate>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
