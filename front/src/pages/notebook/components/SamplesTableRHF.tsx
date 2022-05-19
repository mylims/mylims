import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import {
  FieldProps,
  RHFControllerProps,
  RHFValidationProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';

import { SamplesTable } from './SamplesTable';

export type SamplesTableRHFProps = {
  appendToNotebook(this: void, sample: string): void;
} & FieldProps &
  RHFValidationProps &
  RHFControllerProps;
export default function SamplesTableRHF(props: SamplesTableRHFProps) {
  const { name, deps, rhfOptions, appendToNotebook } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    formState: { isSubmitted: shouldValidate },
  } = useController({ name, ...rhfOptions });

  const handleChange = useCallback(
    (value: string) => {
      setValue(name, [...field.value, value], {
        shouldTouch: true,
        shouldValidate,
      });
      if (deps && shouldValidate) void trigger(deps);
    },
    [setValue, shouldValidate, name, trigger, deps],
  );

  return (
    <SamplesTable
      samples={field.value}
      addSample={handleChange}
      appendToNotebook={(val) => appendToNotebook(val)}
    />
  );
}
