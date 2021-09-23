import { useField } from 'formik';
import React from 'react';

import {
  SearchSelect,
  SearchSelectProps,
  SimpleSearchSelectProps,
} from '../basic/SearchSelect';
import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import { FieldProps } from '../util';

export type SearchSelectFieldProps<OptionType> = Omit<
  SearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error'
> &
  FieldProps;

export type SimpleSearchSelectFieldProps<OptionType> = Omit<
  SimpleSearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error' | 'onBlur'
> &
  FieldProps;

export function SearchSelectField<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectFieldProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSearchSelectFieldProps<OptionType>
    : SearchSelectFieldProps<OptionType>,
): JSX.Element {
  const { name, ...searchSelectProps } = props;
  const [field, meta, formik] = useField<OptionType | null>(name);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <SearchSelect<any>
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
