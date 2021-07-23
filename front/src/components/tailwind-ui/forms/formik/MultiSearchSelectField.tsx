import { useField } from 'formik';
import React from 'react';

import {
  MultiSearchSelect,
  MultiSearchSelectProps,
  SimpleMultiSearchSelectProps,
} from '../basic/MultiSearchSelect';
import { SimpleSelectOption } from '../basic/Select';

interface MultiSearchSelectFieldProps<OptionType>
  extends Omit<
    MultiSearchSelectProps<OptionType>,
    'selected' | 'onSelect' | 'error' | 'onBlur'
  > {
  name: string;
}

interface SimpleMultiSearchSelectFieldProps<OptionType>
  extends Omit<
    SimpleMultiSearchSelectProps<OptionType>,
    'selected' | 'onSelect' | 'error' | 'onBlur'
  > {
  name: string;
}

export function MultiSearchSelectField<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectFieldProps<OptionType>
    : MultiSearchSelectFieldProps<OptionType>,
): JSX.Element {
  const { name, ...otherProps } = props;
  const [field, meta, formik] = useField<OptionType[]>(name);

  function handleSelect(options: OptionType[]) {
    formik.setValue(options);
  }

  return (
    // @ts-ignore
    <MultiSearchSelect
      name={name}
      onBlur={field.onBlur}
      {...otherProps}
      error={meta.touched ? meta.error : undefined}
      selected={field.value}
      onSelect={handleSelect}
    />
  );
}
