import { useField } from 'formik';
import React from 'react';

import {
  SelectProps,
  Select,
  SimpleSelectProps,
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import { FieldProps } from '../util';

export type SelectFieldProps<OptionType> = Omit<
  SelectProps<OptionType>,
  'selected' | 'onSelect' | 'error'
> &
  FieldProps;

export type SimpleSelectFieldProps<OptionType> = Omit<
  SimpleSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error'
> &
  FieldProps;

export function SelectField<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSelectFieldProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSelectFieldProps<OptionType>
    : SelectFieldProps<OptionType>,
): JSX.Element {
  const { name, ...selectProps } = props;
  const [field, meta, formik] = useField<OptionType | null>(name);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Select<any>
      selected={field.value}
      onSelect={(option: OptionType | undefined) => {
        formik.setValue(option || null);
        formik.setTouched(true, false);
      }}
      error={meta.touched ? meta.error : undefined}
      {...selectProps}
    />
  );
}
