import { useField } from 'formik';
import React from 'react';

import { CheckboxProps, Checkbox } from '../basic/Checkbox';

export type CheckboxFieldProps = CheckboxProps;

export function CheckboxField(props: CheckboxFieldProps): JSX.Element {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <Checkbox
      {...props}
      error={meta.touched ? meta.error : undefined}
      {...field}
    />
  );
}
