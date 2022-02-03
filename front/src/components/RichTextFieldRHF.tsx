import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import {
  defaultErrorSerializer,
  FieldProps,
  RHFRegisterProps,
  useCheckedFormRHFContext,
} from '@/components/tailwind-ui';
import {
  RichTextEditorProps,
  RichTextEditor,
} from '@/components/RichTextEditor';
import { Descendant } from 'slate';

export type RichTextFieldRHFProps = Omit<
  RichTextEditorProps,
  'value' | 'onChange'
> &
  FieldProps &
  RHFRegisterProps;
export function RichTextFieldRHF(props: RichTextFieldRHFProps) {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    ...otherProps
  } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted: shouldValidate },
  } = useController({ name });
  console.log(field.value);

  const handleChange = useCallback(
    (value: Descendant[]) => {
      setValue(name, value, { shouldTouch: true, shouldValidate });
      if (deps && shouldValidate) {
        void trigger(deps);
      }
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
