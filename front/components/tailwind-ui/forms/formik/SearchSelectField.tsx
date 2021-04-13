import { useField } from 'formik';
import React from 'react';

import {
  defaultGetValue,
  defaultRenderOption,
  SimpleOption,
} from '../../utils/search-select-utils';
import {
  SearchSelect,
  SearchSelectProps,
  SimpleSearchSelectProps,
} from '../basic/SearchSelect';

interface SearchSelectFieldProps<T>
  extends Omit<SearchSelectProps<T>, 'selected' | 'onSelect' | 'error'> {
  name: string;
  resolveTo: 'value' | 'object';
}

interface SimpleSearchSelectFieldProps<T extends SimpleOption>
  extends Omit<
    SimpleSearchSelectProps<T>,
    'selected' | 'onSelect' | 'error' | 'onBlur'
  > {
  name: string;
  resolveTo: 'value' | 'object';
}

export function SearchSelectField<T extends SimpleOption>(
  props: SimpleSearchSelectFieldProps<T>,
): JSX.Element;
export function SearchSelectField<T>(
  props: SearchSelectFieldProps<T>,
): JSX.Element;
export function SearchSelectField<T>(
  props: T extends SimpleOption
    ? SimpleSearchSelectFieldProps<T>
    : SearchSelectFieldProps<T>,
): JSX.Element {
  const {
    name,
    resolveTo,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    options,
    ...otherProps
  } = props;
  const [field, meta, formik] = useField(name);

  const selected =
    resolveTo === 'object'
      ? field.value
      : options.find((option) => getValue(option) === field.value);

  function handleSelect(option: T | undefined) {
    if (option === undefined) {
      formik.setValue(undefined);
    } else {
      formik.setValue(resolveTo === 'object' ? option : getValue(option));
    }
  }

  return (
    <SearchSelect
      name={name}
      getValue={getValue}
      renderOption={renderOption}
      options={options}
      onBlur={field.onBlur}
      {...otherProps}
      error={meta.touched ? meta.error : undefined}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
