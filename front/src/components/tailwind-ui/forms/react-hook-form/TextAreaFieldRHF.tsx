import React from 'react';
import { get } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { TextArea, TextAreaProps } from '../basic/TextArea';
import {
  defaultErrorSerializer,
  FieldProps,
  getEmptyValueProp,
  getSetValueAs,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

import { useRHFConfig } from './FormRHF';
import { InputFieldRHFCustomProps } from './InputFieldRHF';

export type TextAreaFieldProps = TextAreaProps;

export type TextAreaFieldRHFProps = TextAreaFieldProps &
  FieldProps &
  RHFValidationProps &
  InputFieldRHFCustomProps;

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
    emptyValue,
    deps,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;
  const rhfConfig = useRHFConfig();
  const finalEmptyValue = getEmptyValueProp(props, rhfConfig);
  return (
    <TextArea
      {...otherProps}
      error={serializeError(error)}
      {...register(props.name, {
        setValueAs: getSetValueAs(finalEmptyValue, 'text'),
        ...rhfOptions,
        deps,
      })}
    />
  );
}
