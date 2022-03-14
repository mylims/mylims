import React, { useState } from 'react';

import { API_URL } from '@/../env';
import ElnLayout from '@/components/ElnLayout';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import WaferDiameterField from '@/components/WaferDiameterField';
import {
  DropzoneFieldRHF,
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
    >
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div className="grid-cols-auto grid gap-4">
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
            <InputFieldRHF
              name="meta.locationComment"
              label="Location comment"
            />
            <InputFieldRHF name="meta.rs" label="Rs (Ohm/sq)" type="number" />
            <InputFieldRHF name="meta.ns" label="Ns (e13/cm^2)" type="number" />
            <InputFieldRHF
              name="meta.mobility"
              label="Mobility (cm^2/Vs)"
              type="number"
            />
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
            options={['chip', '2 inch', '4 inch', '6 inch'].map((value) => ({
              value,
              label: value,
            }))}
            required
          />
          <RichTextFieldRHF
            className="max-w-7xl"
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

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
