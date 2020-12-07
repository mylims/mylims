import { useField } from 'formik';
import React, { useMemo } from 'react';

import {
  defaultGetValue,
  defaultRenderOption,
  SimpleOption,
} from '../../utils/search-select-utils';
import {
  MultiSearchSelect,
  MultiSearchSelectProps,
  SimpleMultiSearchSelectProps,
} from '../basic/MultiSearchSelect';

interface MultiSearchSelectFieldProps<T>
  extends Omit<MultiSearchSelectProps<T>, 'selected' | 'onSelect' | 'error'> {
  name: string;
  resolveTo: 'value' | 'object';
}

interface SimpleMultiSearchSelectFieldProps<T extends SimpleOption>
  extends Omit<
    SimpleMultiSearchSelectProps<T>,
    'selected' | 'onSelect' | 'error'
  > {
  name: string;
  resolveTo: 'value' | 'object';
}

export function MultiSearchSelectField<T extends SimpleOption>(
  props: SimpleMultiSearchSelectFieldProps<T>,
): JSX.Element;
export function MultiSearchSelectField<T>(
  props: MultiSearchSelectFieldProps<T>,
): JSX.Element;
export function MultiSearchSelectField<T>(
  props: T extends SimpleOption
    ? SimpleMultiSearchSelectFieldProps<T>
    : MultiSearchSelectFieldProps<T>,
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

  const fieldValue = field.value;
  const selected = useMemo(() => {
    if (resolveTo === 'object') {
      return fieldValue;
    } else {
      return (fieldValue as (string | number)[]).map((value) =>
        options.find((option) => getValue(option) === value),
      );
    }
  }, [fieldValue, options, getValue, resolveTo]);

  function handleSelect(options: T[]) {
    if (resolveTo === 'object') {
      formik.setValue(options);
    } else {
      formik.setValue(options.map(getValue));
    }
  }

  return (
    <MultiSearchSelect
      name={name}
      getValue={getValue}
      renderOption={renderOption}
      options={options}
      {...otherProps}
      error={meta.touched ? meta.error : undefined}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
