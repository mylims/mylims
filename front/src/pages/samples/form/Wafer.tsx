import React, { useState } from 'react';
import { Descendant } from 'slate';

import ElnLayout from '@/components/ElnLayout';
import {
  DropzoneFieldRHF,
  InputFieldRHF,
  optionalString,
} from '@/components/tailwind-ui';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import DefaultCreate from '@/pages/samples/form/Default';
import { RichTextEditor } from '@/components/RichTextEditor';

const waferCreateSchema = {
  size: optionalString(),
  purpose: optionalString(),
  heterostructure: optionalString(),
  substrate: optionalString(),
  supplier: optionalString(),
  supplierNumber: optionalString(),
  location: optionalString(),
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>' },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
];

export default function WaferCreate() {
  const [value, setValue] = useState<Descendant[]>(initialValue);
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
            <InputFieldRHF name="description" label="Commentary" />
            <MultiSelect name="labels" label="Labels" />
            <InputFieldRHF name="meta.purpose" label="Purpose" />
            <InputFieldRHF
              name="meta.size"
              label="Diameter (inch)"
              type="number"
            />
            <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
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
          <RichTextEditor value={value} onChange={(val) => setValue(val)} />
        </div>
      </div>
    </DefaultCreate>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
