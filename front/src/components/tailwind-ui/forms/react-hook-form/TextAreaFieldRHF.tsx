import React from 'react';
import { get } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { TextArea } from '../basic/TextArea';
import { TextAreaFieldProps } from '../formik/TextAreaField';
import { defaultErrorSerializer, FieldProps, RHFRegisterProps } from '../util';

export type TextAreaFieldRHFProps = TextAreaFieldProps & FieldProps;

export function TextAreaFieldRHF(
  props: TextAreaFieldRHFProps & RHFRegisterProps,
): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();
  const error = get(errors, props.name);
  const {
    rhfOptions,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;
  return (
    <TextArea
      {...otherProps}
      error={serializeError(error)}
      {...register(props.name, rhfOptions)}
    />
  );
}
