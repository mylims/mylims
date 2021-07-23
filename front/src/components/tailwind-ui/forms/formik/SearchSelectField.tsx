import { useField } from 'formik';
import React from 'react';

import {
  SearchSelect,
  SearchSelectProps,
  SimpleSearchSelectProps,
} from '../basic/SearchSelect';
import { SimpleSelectOption } from '../basic/Select';

export interface SearchSelectFieldProps<OptionType>
  extends Omit<
    SearchSelectProps<OptionType>,
    'selected' | 'onSelect' | 'error'
  > {
  name: string;
}

export interface SimpleSearchSelectFieldProps<OptionType>
  extends Omit<
    SimpleSearchSelectProps<OptionType>,
    'selected' | 'onSelect' | 'error' | 'onBlur'
  > {
  name: string;
}

export function SearchSelectField<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleSearchSelectFieldProps<OptionType>
    : SearchSelectFieldProps<OptionType>,
): JSX.Element {
  const { name, ...searchSelectProps } = props;
  const [field, meta, formik] = useField<OptionType | null>(name);

  return (
    // @ts-ignore
    <SearchSelect
      name={name}
      onBlur={field.onBlur}
      error={meta.touched ? meta.error : undefined}
      {...searchSelectProps}
      // Put these at the end because the spread might add them from the search select hook's result.
      selected={field.value}
      onSelect={(option: OptionType | undefined) => {
        formik.setValue(option || null);
        formik.setTouched(true, false);
      }}
    />
  );
}
