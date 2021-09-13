import React, { ChangeEvent, useCallback } from 'react';
import { get, useFormContext, useWatch } from 'react-hook-form';

import { useInputAsyncValidation } from '../../hooks/useInputAsyncValidationHook';
import { InputProps, Input } from '../basic/Input';
import { AsyncInputFieldProps } from '../formik/InputField';
import { defaultErrorSerializer, FieldProps } from '../util';

export type AsyncInputFieldRHFProps = AsyncInputFieldProps & FieldProps;

export function AsyncInputFieldRHF(
  props: AsyncInputFieldProps & FieldProps,
): JSX.Element {
  const {
    asyncValidationCallback,
    debounceDelay = 500,
    serializeError = defaultErrorSerializer,
    ...inputProps
  } = props;
  const {
    register,
    formState: { errors, touchedFields },
  } = useFormContext();
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
      {...register(props.name)}
      error={errorMessage}
      valid={error ? undefined : inputValidationProps.valid}
      loading={inputValidationProps.loading || inputProps.loading}
    />
  );
}

export type InputFieldRHFProps = InputProps & FieldProps;

export function InputFieldRHF(props: InputFieldRHFProps) {
  const {
    defaultValue,
    onChange: inputOnChange,
    serializeError = defaultErrorSerializer,
    ...otherInputProps
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, props.name);
  const rhfProps = register(props.name, {
    setValueAs:
      props.type === 'number'
        ? (value: string) => {
            if (!value) return undefined;
            return Number(value);
          }
        : undefined,
  });

  const { onChange: formHookOnChange, ...inputProps } = rhfProps;
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      inputOnChange?.(event);
      formHookOnChange?.(event);
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
