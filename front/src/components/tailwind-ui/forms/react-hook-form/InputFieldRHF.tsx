import React, { ChangeEvent, useCallback } from 'react';
import { get } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { InputProps, Input } from '../basic/Input';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFRegisterProps,
  EmptyValue,
  getSetValueAs,
  getEmptyValueProp,
  RHFValidationProps,
} from '../util';

import { useRHFConfig } from './FormRHF';

export type InputFieldProps = InputProps;

export interface InputFieldRHFCustomProps {
  /**
   * State value when user enters an empty value in the input
   * This option is ignored if setValueAs is set in rhfOptions
   */
  emptyValue?: EmptyValue;
}

export type InputFieldRHFProps = InputProps &
  FieldProps &
  RHFValidationProps &
  RHFRegisterProps &
  InputFieldRHFCustomProps;

export function InputFieldRHF(props: InputFieldRHFProps) {
  const {
    defaultValue,
    onChange: inputOnChange,
    serializeError = defaultErrorSerializer,
    deps,
    rhfOptions,
    emptyValue,
    ...otherInputProps
  } = props;
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();
  const rhfConfig = useRHFConfig();
  const error = get(errors, props.name);

  const finalEmptyValue = getEmptyValueProp(props, rhfConfig);
  const rhfProps = register(props.name, {
    setValueAs: getSetValueAs(finalEmptyValue, props.type),
    ...rhfOptions,
    deps,
  });

  const { onChange: formHookOnChange, ...inputProps } = rhfProps;
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      inputOnChange?.(event);
      void formHookOnChange?.(event);
    },
    [inputOnChange, formHookOnChange],
  );

  return (
    <Input
      onChange={onChange}
      {...otherInputProps}
      {...inputProps}
      error={serializeError(error)}
    />
  );
}
