import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import {
  FieldProps,
  RHFValidationProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';

import { SamplesTable } from './SamplesTable';

export type SamplesTableRHFProps = FieldProps & RHFValidationProps;
export default function SamplesTableRHF(props: SamplesTableRHFProps) {
  const { name, deps } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    formState: { isSubmitted: shouldValidate },
  } = useController({ name });

  const addSample = useCallback(
    (value: string) => {
      const set = Array.from(new Set([...field.value, value]));
      for (let i = 0; i < set.length; i++) {
        setValue(`${name}[${i}]`, set[i], {
          shouldTouch: true,
          shouldValidate,
        });
      }

      if (deps && shouldValidate) void trigger(deps);
    },
    [setValue, shouldValidate, name, trigger, deps, field.value],
  );

  return <SamplesTable samples={field.value} addSample={addSample} />;
}
