import { useField } from 'formik';
import React from 'react';

import {
  SelectProps,
  Select,
  SimpleSelectProps,
  SimpleSelectOption,
} from '../basic/Select';

export interface SelectFieldProps<OptionType>
  extends Omit<SelectProps<OptionType>, 'selected' | 'onSelect' | 'error'> {
  /**
   * Field name.
   */
  name: string;
}

export interface SimpleSelectFieldProps<OptionType>
  extends Omit<
    SimpleSelectProps<OptionType>,
    'selected' | 'onSelect' | 'error'
  > {
  /**
   * Field name.
   */
  name: string;
}

export function SelectField<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleSelectFieldProps<OptionType>
    : SelectFieldProps<OptionType>,
): JSX.Element {
  const { name, ...selectProps } = props;
  const [field, meta, formik] = useField<OptionType | null>(name);

  return (
    // @ts-ignore
    <Select
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
