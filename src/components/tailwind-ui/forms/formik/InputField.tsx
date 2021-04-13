import { useField } from 'formik';
import React from 'react';

import {
  InputAsyncValidationCallback,
  useInputAsyncValidation,
} from '../../hooks/useInputAsyncValidationHook';
import { InputProps, Input } from '../basic/Input';

export type InputFieldProps = InputProps;

export interface AsyncInputFieldProps extends InputFieldProps {
  asyncValidationCallback: InputAsyncValidationCallback;
  debounceDelay?: number;
}

export function AsyncInputField(props: AsyncInputFieldProps): JSX.Element {
  const { asyncValidationCallback, debounceDelay = 500, ...inputProps } = props;
  const [field, meta] = useField(inputProps);
  const inputValidationProps = useInputAsyncValidation(
    // The condition prevents triggering an async validation if the field is already errored
    meta.error ? '' : field.value,
    debounceDelay,
    asyncValidationCallback,
  );

  const shouldDisplayError = meta.touched
    ? meta.error || inputValidationProps.error
    : !meta.error && inputValidationProps.error;
  const error = shouldDisplayError
    ? meta.error || inputValidationProps.error
    : undefined;

  return (
    <Input
      {...inputProps}
      {...field}
      error={error}
      valid={error ? undefined : inputValidationProps.valid}
      loading={inputValidationProps.loading || inputProps.loading}
    />
  );
}

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
