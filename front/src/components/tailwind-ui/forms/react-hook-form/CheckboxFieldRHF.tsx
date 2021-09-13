import React from 'react';
import { useFormContext, get } from 'react-hook-form';

import { Checkbox } from '../basic/Checkbox';
import { CheckboxFieldProps } from '../formik/CheckboxField';
import { defaultErrorSerializer, FieldProps } from '../util';

export type CheckboxFieldRHFProps = Omit<CheckboxFieldProps, 'checked'> &
  FieldProps;

export function CheckboxFieldRHF(props: CheckboxFieldRHFProps): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, props.name);

  const { serializeError = defaultErrorSerializer, ...otherProps } = props;
  return (
    <Checkbox
      {...otherProps}
      {...register(props.name)}
      error={serializeError(error)}
    />
  );
}
