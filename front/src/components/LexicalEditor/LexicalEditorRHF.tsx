import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import {
  defaultErrorSerializer,
  FieldProps,
  RHFControllerProps,
  RHFValidationProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';

import { LexicalFieldProps, LexicalField } from './LexicalField';

export type RichTextFieldRHFProps = Omit<
  LexicalFieldProps,
  'value' | 'onChange'
> &
  FieldProps &
  RHFValidationProps &
  RHFControllerProps;
export function LexicalEditorRHF(props: RichTextFieldRHFProps) {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    rhfOptions,
    ...otherProps
  } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted: shouldValidate },
  } = useController({ name, ...rhfOptions });

  const handleChange = useCallback(
    (value: LexicalFieldProps['value']) => {
      setValue(name, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) void trigger(deps);
    },
    [setValue, shouldValidate, name, trigger, deps],
  );

  return (
    <LexicalField
      name={name}
      {...otherProps}
      error={serializeError(error)}
      value={field.value}
      onChange={handleChange}
    />
  );
}
