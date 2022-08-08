import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';
import { MeasurementNotebook } from '@/pages/notebook/models';

import { LexicalFieldProps, LexicalField } from './LexicalField';

const SAMPLES_NAME = 'samples';
const MEASUREMENTS_NAME = 'measurements';

function useConstController(name: string, extended?: boolean) {
  const { field } = useController({ name });
  if (extended) return { value: [] };
  return field;
}

export type RichTextFieldRHFProps = Omit<
  LexicalFieldProps,
  | 'value'
  | 'onChange'
  | 'samples'
  | 'onSamplesChange'
  | 'measurements'
  | 'onMeasurementsChange'
> &
  FieldProps &
  RHFValidationProps;
export function LexicalEditorRHF(props: RichTextFieldRHFProps) {
  const {
    deps,
    name,
    serializeError = defaultErrorSerializer,
    extended,
    ...otherProps
  } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted: shouldValidate },
  } = useController({ name });
  const samples = useConstController(SAMPLES_NAME, extended);
  const measurements = useConstController(MEASUREMENTS_NAME, extended);

  const handleChange = useCallback(
    (value: string) => {
      setValue(name, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) void trigger(deps);
    },
    [setValue, shouldValidate, name, trigger, deps],
  );
  const onSamplesChange = useCallback(
    (value: string[]) => {
      if (!extended) return;
      setValue(SAMPLES_NAME, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) void trigger(deps);
    },
    [extended, setValue, shouldValidate, trigger, deps],
  );
  const onMeasurementsChange = useCallback(
    (value: MeasurementNotebook[]) => {
      if (!extended) return;
      setValue(MEASUREMENTS_NAME, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) void trigger(deps);
    },
    [extended, setValue, shouldValidate, trigger, deps],
  );

  return (
    <LexicalField
      name={name}
      extended={extended}
      {...otherProps}
      error={serializeError(error)}
      value={field.value}
      onChange={handleChange}
      samples={samples.value}
      onSamplesChange={onSamplesChange}
      measurements={measurements.value}
      onMeasurementsChange={onMeasurementsChange}
    />
  );
}
