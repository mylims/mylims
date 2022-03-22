import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import { InputFieldRHF, optionalString } from '@/components/tailwind-ui';

import DefaultUpdate from './Default';

const dyeUpdateSchema = {
  comment: optionalString(),
};

export default function DyeUpdate() {
  return (
    <DefaultUpdate codeLength={3} kind="dye" metaSchema={dyeUpdateSchema}>
      <InputFieldRHF name="meta.comment" label="Comment" />
    </DefaultUpdate>
  );
}

DyeUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update dye">{page}</ElnLayout>
);
