import React from 'react';

import { InputFieldRHF } from '@/components/tailwind-ui';

export function CreateTransferMeasurement() {
  return (
    <>
      <InputFieldRHF
        name="derived.thresholdVoltage.value"
        label="Threshold voltage"
        type="number"
        required
      />
      <InputFieldRHF
        name="derived.subthresholdSlope.slope"
        label="Subthreshold slope"
        type="number"
        required
      />
    </>
  );
}
