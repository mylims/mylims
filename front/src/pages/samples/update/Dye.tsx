import React from 'react';

import { API_URL } from '@/../env';
import AttachmentsTableRHF from '@/components/AttachmentsTableRHF';
import ElnLayout from '@/components/ElnLayout';
import { RichTextFieldRHF } from '@/components/RichTextFieldRHF';
import {
  DropzoneFieldRHF,
  InputFieldRHF,
  optionalString,
} from '@/components/tailwind-ui';

import DefaultUpdate from './Default';

const dyeUpdateSchema = {
  comment: optionalString(),
};

export default function DyeUpdate() {
  return (
    <DefaultUpdate codeLength={3} kind="dye" metaSchema={dyeUpdateSchema}>
      <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
        <div className="col-span-2">
          <div className="grid-cols-auto grid gap-4">
            <InputFieldRHF name="meta.comment" label="Comment" />
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

DyeUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update dye">{page}</ElnLayout>
);
