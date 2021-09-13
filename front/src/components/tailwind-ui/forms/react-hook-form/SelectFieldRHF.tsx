import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import {
  Select,
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import {
  SelectFieldProps,
  SimpleSelectFieldProps,
} from '../formik/SelectField';
import { defaultErrorSerializer } from '../util';

export function SelectFieldRHF<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSelectFieldProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSelectFieldProps<OptionType>
    : SelectFieldProps<OptionType>,
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    ...selectProps
  } = props;
  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: props.name,
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Select<any>
      selected={field.value}
      onSelect={(option: OptionType | undefined) => {
        setValue(name, option || null, {
          shouldValidate: isSubmitted,
          shouldTouch: true,
        });
      }}
      error={serializeError(error)}
      {...selectProps}
    />
  );
}
