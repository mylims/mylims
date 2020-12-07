import { useField } from 'formik';
import React from 'react';

import { InputProps, Input } from '../basic/Input';

export type InputFieldProps = InputProps;

export function InputField(props: InputFieldProps): JSX.Element {
  const [field, meta] = useField(props);
  return (
    <Input
      {...props}
      {...field}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
