import React from 'react';
import { boolean } from 'yup';

import { API_URL } from '@/../env';
import AttachmentsTableRHF from '@/components/AttachmentsTableRHF';
import ElnLayout from '@/components/ElnLayout';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import {
  DropzoneFieldRHF,
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
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div className="grid-cols-auto grid items-end gap-4">
            <InputFieldRHF name="project" label="Project" />
            <InputFieldRHF name="meta.purpose" label="Purpose" />
            <ToggleFieldRHF name="meta.reserved" label="Reserved" />
            <InputFieldRHF name="meta.labelPurpose" label="Label purpose" />
            <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
          </div>
        </div>
        <div className="col-span-2">
          <DropzoneFieldRHF label="Attachments" name="attachments" showList />
          <AttachmentsTableRHF name="prevAttachments" className="mt-2" />
        </div>
        <div className="row-span-2">
          <RichTextFieldRHF
            className="max-w-7xl h-full"
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

SampleUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update sample">{page}</ElnLayout>
);
