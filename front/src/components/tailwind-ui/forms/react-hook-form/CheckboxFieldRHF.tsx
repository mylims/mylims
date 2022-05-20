import React from 'react';
import { get } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { Checkbox, CheckboxProps } from '../basic/Checkbox';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

export type CheckboxFieldProps = CheckboxProps;

export type CheckboxFieldRHFProps = Omit<CheckboxFieldProps, 'checked'> &
  FieldProps &
  RHFValidationProps &
  RHFRegisterProps;

export function CheckboxFieldRHF(props: CheckboxFieldRHFProps): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();

  const error = get(errors, props.name);

  const {
    serializeError = defaultErrorSerializer,
    rhfOptions,
    deps,
    ...otherProps
  } = props;
  return (
    <Checkbox
      {...otherProps}
      {...register(props.name, {
        ...rhfOptions,
        deps,
      })}
      error={serializeError(error)}
    />
  );
}
