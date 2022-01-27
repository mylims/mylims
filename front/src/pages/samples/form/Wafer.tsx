import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import {
  DropzoneFieldRHF,
  InputFieldRHF,
  optionalString,
  TextAreaFieldRHF,
} from '@/components/tailwind-ui';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import DefaultCreate from '@/pages/samples/form/Default';

const waferCreateSchema = {
  size: optionalString(),
  purpose: optionalString(),
  heterostructure: optionalString(),
  substrate: optionalString(),
  supplier: optionalString(),
  supplierNumber: optionalString(),
  location: optionalString(),
};

export default function WaferCreate() {
  return (
    <DefaultCreate codeLength={1} kind="wafer" metaSchema={waferCreateSchema}>
      <div className="flex flex-col md:grid md:grid-flow-col md:grid-rows-3 md:gap-4">
        <div className="col-span-2 row-span-2">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            }}
          >
            <InputFieldRHF name="sampleCode.0" label="Wafer name" required />
            <InputFieldRHF name="project" label="Project" />
            <InputFieldRHF name="title" label="Title" />
            <InputFieldRHF name="description" label="Description" />
            <MultiSelect name="labels" label="Labels" />
            <InputFieldRHF name="meta.purpose" label="Purpose" />
            <InputFieldRHF name="meta.size" label="Dimension" type="number" />
            <InputFieldRHF
              name="meta.heterostructure"
              label="Heterostructure"
            />
            <InputFieldRHF name="meta.substrate" label="Substrate" />
            <InputFieldRHF name="meta.supplier" label="Supplier" />
            <InputFieldRHF
              name="meta.supplierNumber"
              label="Supplier wafer number"
            />
            <InputFieldRHF name="meta.location" label="Location" />
          </div>
        </div>
        <div className="col-span-2">
          <DropzoneFieldRHF label="Attachments" name="attachments" showList />
        </div>
        <div className="row-span-3">
          <TextAreaFieldRHF
            label="EPI structure"
            name="meta.epiStructure"
            rows={20}
          />
        </div>
      </div>
    </DefaultCreate>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
