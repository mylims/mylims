import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import WaferDiameterField from '@/components/WaferDiameterField';
import {
  InputFieldRHF,
  requiredObject,
  requiredString,
} from '@/components/tailwind-ui';
import { baseForm, baseSchema } from '@/pages/samples/models/Wafer';

import DefaultCreate from './Default';

const waferCreateSchema = {
  size: requiredObject({ value: requiredString(), label: requiredString() }),
  ...baseSchema,
};

export default function WaferCreate() {
  const [defaultCreation, setDefaultCreation] = useState(true);
  return (
    <DefaultCreate
      codeLength={1}
      kind="wafer"
      metaSchema={waferCreateSchema}
      defaultCreation={defaultCreation}
      sampleCode={[]}
      formEditor={
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
      }
    >
      <InputFieldRHF name="sampleCode.0" label="Wafer name" required />
      {baseForm}
    </DefaultCreate>
  );
}

WaferCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create new wafer">{page}</ElnLayout>
);
