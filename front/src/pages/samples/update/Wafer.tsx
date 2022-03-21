import React from 'react';

import { API_URL } from '@/../env';
import AttachmentsTableRHF from '@/components/AttachmentsTableRHF';
import ElnLayout from '@/components/ElnLayout';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import {
  DropzoneFieldRHF,
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
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div className="grid-cols-auto grid gap-4">
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
          <AttachmentsTableRHF name="prevAttachments" className="mt-2" />
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
    </DefaultUpdate>
  );
}

WaferUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update wafer">{page}</ElnLayout>
);
