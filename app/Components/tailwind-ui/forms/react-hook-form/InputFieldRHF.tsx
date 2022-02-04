import React, { ChangeEvent, useCallback } from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { useInputAsyncValidation } from '../../hooks/useInputAsyncValidationHook';
import { InputProps, Input } from '../basic/Input';
import { AsyncInputFieldProps } from '../formik/InputField';
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

export interface InputFieldRHFCustomProps {
  /**
   * State value when user enters an empty value in the input
   * This option is ignored if setValueAs is set in rhfOptions
   */
  emptyValue?: EmptyValue;
}

export type AsyncInputFieldRHFProps = AsyncInputFieldProps &
  FieldProps &
  RHFValidationProps &
  RHFRegisterProps &
  InputFieldRHFCustomProps;

export function AsyncInputFieldRHF(
  props: AsyncInputFieldRHFProps,
): JSX.Element {
  const {
    asyncValidationCallback,
    debounceDelay = 500,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    emptyValue,
    ...inputProps
  } = props;
  const finalEmptyValue = getEmptyValueProp(props);
  const {
    register,
    formState: { errors, touchedFields },
  } = useCheckedFormRHFContext();
  const fieldValue = useWatch({
    name: props.name,
  });
  const error = get(errors, props.name);
  const inputValidationProps = useInputAsyncValidation(
    // The condition prevents triggering an async validation if the field is already errored
    error ? '' : fieldValue,
    debounceDelay,
    asyncValidationCallback,
  );

  const shouldDisplayError = touchedFields[props.name]
    ? error?.message || inputValidationProps.error
    : !error && inputValidationProps.error;

  const errorMessage = shouldDisplayError
    ? serializeError(error) || inputValidationProps.error
    : undefined;

  return (
    <Input
      {...inputProps}
      {...register(props.name, {
        setValueAs: getSetValueAs(finalEmptyValue, props.type),
        ...rhfOptions,
      })}
      error={errorMessage}
      valid={error ? undefined : inputValidationProps.valid}
      loading={inputValidationProps.loading || inputProps.loading}
    />
  );
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
