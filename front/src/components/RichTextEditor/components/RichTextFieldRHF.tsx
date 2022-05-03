import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';
import { Descendant } from 'slate';

import {
  RichTextEditorProps,
  RichTextEditor,
} from '@/components/RichTextEditor';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFControllerProps,
  RHFValidationProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';

export type RichTextFieldRHFProps = Omit<
  RichTextEditorProps,
  'value' | 'onChange'
> &
  FieldProps &
  RHFValidationProps &
  RHFControllerProps;
export function RichTextFieldRHF(props: RichTextFieldRHFProps) {
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
    (value: Descendant[]) => {
      setValue(name, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) void trigger(deps);
    },
    [setValue, shouldValidate, name, trigger, deps],
  );

  return (
    <RichTextEditor
      name={name}
      {...otherProps}
      error={serializeError(error)}
      value={field.value}
      onChange={handleChange}
    />
  );
}
