import React from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import {
  InputAsyncValidationCallback,
  useInputAsyncValidation,
} from '../../hooks/useInputAsyncValidationHook';
import { Input } from '../basic/Input';
import {
  defaultErrorSerializer,
  FieldProps,
  getEmptyValueProp,
  getSetValueAs,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

import { InputFieldProps, InputFieldRHFCustomProps } from './InputFieldRHF';

export interface AsyncInputFieldProps extends InputFieldProps {
  asyncValidationCallback: InputAsyncValidationCallback;
  debounceDelay?: number;
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
