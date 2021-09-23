import React from 'react';
import { useFormContext, get } from 'react-hook-form';

import { Checkbox } from '../basic/Checkbox';
import { CheckboxFieldProps } from '../formik/CheckboxField';
import { defaultErrorSerializer, FieldProps, RHFRegisterProps } from '../util';

export type CheckboxFieldRHFProps = Omit<CheckboxFieldProps, 'checked'> &
  FieldProps &
  RHFRegisterProps;

export function CheckboxFieldRHF(props: CheckboxFieldRHFProps): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, props.name);

  const {
    serializeError = defaultErrorSerializer,
    rhfOptions,
    ...otherProps
  } = props;
  return (
    <Checkbox
      {...otherProps}
      {...register(props.name, rhfOptions)}
      error={serializeError(error)}
    />
  );
}
