import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import { InputFieldRHF, optionalString } from '@/components/tailwind-ui';

import DefaultUpdate from './Default';

const deviceUpdateSchema = {
  comment: optionalString(),
};

export default function DeviceUpdate() {
  return (
    <DefaultUpdate codeLength={4} kind="device" metaSchema={deviceUpdateSchema}>
      <InputFieldRHF name="meta.comment" label="Comment" />
    </DefaultUpdate>
  );
}

DeviceUpdate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Update device">{page}</ElnLayout>
);
