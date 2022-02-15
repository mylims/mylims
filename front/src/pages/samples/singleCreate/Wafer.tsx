import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import WaferDiameterField from '@/components/WaferDiameterField';
import {
  DropzoneFieldRHF,
  InputFieldRHF,
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
  supplierNumber: optionalString(),
  location: optionalString(),
};

export default function WaferCreate() {
  const [defaultCreation, setDefaultCreation] = useState(true);
  return (
    <DefaultCreate
      codeLength={1}
      kind="wafer"
      metaSchema={waferCreateSchema}
      defaultCreation={defaultCreation}
    >
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            }}
          >
            <InputFieldRHF name="sampleCode.0" label="Wafer name" required />
            <InputFieldRHF name="project" label="Project" />
            <InputFieldRHF name="title" label="Title" />
            <InputFieldRHF name="comment" label="Comment" />
            <MultiSelect name="labels" label="Labels" />
            <InputFieldRHF name="meta.purpose" label="Purpose" />
            <InputFieldRHF name="meta.epiStructure" label="EPI structure" />
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
          <WaferDiameterField
            name="meta.size"
            label="Diameter"
            defaultCreation={defaultCreation}
            setDefaultCreation={setDefaultCreation}
            options={['2 inch', '4 inch', '6 inch'].map((value) => ({
              value,
              label: value,
            }))}
            required
          />
          <RichTextFieldRHF
            className="max-w-7xl"
            name="description"
            label="Description"
          />
        </div>
      </div>
    </DefaultCreate>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
