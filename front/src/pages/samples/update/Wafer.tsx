import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import {
  InputFieldRHF,
  optionalNumber,
  optionalString,
} from '@/components/tailwind-ui';

import DefaultUpdate from './Default';

const waferUpdateSchema = {
  size: optionalString(),
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

export default function WaferUpdate() {
  return (
    <DefaultUpdate codeLength={1} kind="wafer" metaSchema={waferUpdateSchema}>
      <InputFieldRHF name="sampleCode.0" label="Wafer name" disabled />
      <InputFieldRHF name="meta.size" label="Diameter" disabled />
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
    </DefaultUpdate>
  );
}

WaferUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update wafer">{page}</ElnLayout>
);
