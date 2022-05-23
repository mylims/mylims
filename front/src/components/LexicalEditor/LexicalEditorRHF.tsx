import React from 'react';
import { useController } from 'react-hook-form';

import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
  // useCheckedFormRHFContext,
} from '@/components/tailwind-ui';

import { LexicalFieldProps, LexicalField } from './LexicalField';

export type RichTextFieldRHFProps = Omit<
  LexicalFieldProps,
  'value' | 'onChange'
> &
  FieldProps &
  RHFValidationProps;
export function LexicalEditorRHF(props: RichTextFieldRHFProps) {
  const {
    deps,
    name,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;

  // const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    // field,
    fieldState: { error },
    // formState: { isSubmitted: shouldValidate },
  } = useController({ name });

  // const handleChange = useCallback(
  //   (value: string) => {
  //     setValue(name, value, { shouldTouch: true, shouldValidate });
  //     if (deps && shouldValidate) void trigger(deps);
  //   },
  //   [setValue, shouldValidate, name, trigger, deps],
  // );

  return (
    <LexicalField
      name={name}
      {...otherProps}
      error={serializeError(error)}
      // value={field.value}
      // onChange={handleChange}
    />
  );
}
