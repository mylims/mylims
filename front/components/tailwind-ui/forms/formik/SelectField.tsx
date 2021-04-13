import { useField } from 'formik';
import React, { ReactNode } from 'react';

import { SelectProps, Select, BaseSelectProps } from '../basic/Select';

interface SelectFieldProps<T>
  extends Omit<SelectProps<T>, 'selected' | 'onSelect' | 'error'> {
  name: string;
  resolveTo: 'value' | 'object';
}

interface BaseSelectFieldProps<T>
  extends Omit<BaseSelectProps<T>, 'selected' | 'onSelect' | 'error'> {
  name: string;
  resolveTo: 'value' | 'object';
}

export function SelectField<
  T extends { label: ReactNode; value: string | number }
>(props: BaseSelectFieldProps<T>): JSX.Element;
export function SelectField<T>(props: SelectFieldProps<T>): JSX.Element;
export function SelectField<T>(
  props: SelectFieldProps<T> | BaseSelectFieldProps<T>,
) {
  const { name, resolveTo, getValue, renderOption, ...otherProps } = props;
  const [field, meta, formik] = useField(name);

  // @ts-ignore because of overload
  const getValueFn = getValue ? getValue : (option) => option.value;
  const renderOptionFn = renderOption
    ? renderOption
    : // @ts-ignore because of overload
      (option) => option.label;

  return (
    <Select
      selected={
        resolveTo === 'object'
          ? field.value
          : otherProps.options.find(
              (option) => getValueFn(option) === field.value,
            )
      }
      renderOption={renderOptionFn}
      getValue={getValueFn}
      onSelect={(option) => {
        if (option === undefined) {
          formik.setValue(undefined);
        } else {
          formik.setValue(resolveTo === 'object' ? option : getValueFn(option));
        }

        formik.setTouched(true, false);
      }}
      error={meta.touched ? meta.error : undefined}
      {...otherProps}
    />
  );
}
