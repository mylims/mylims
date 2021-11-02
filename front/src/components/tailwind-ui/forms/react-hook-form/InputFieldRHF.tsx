import React, { ChangeEvent, useCallback } from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { useInputAsyncValidation } from '../../hooks/useInputAsyncValidationHook';
import { InputProps, Input } from '../basic/Input';
import { AsyncInputFieldProps } from '../formik/InputField';
import { defaultErrorSerializer, FieldProps, RHFRegisterProps } from '../util';

export type AsyncInputFieldRHFProps = AsyncInputFieldProps &
  FieldProps &
  RHFRegisterProps;

export function AsyncInputFieldRHF(
  props: AsyncInputFieldRHFProps,
): JSX.Element {
  const {
    asyncValidationCallback,
    debounceDelay = 500,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    ...inputProps
  } = props;
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
      {...register(props.name, rhfOptions)}
      error={errorMessage}
      valid={error ? undefined : inputValidationProps.valid}
      loading={inputValidationProps.loading || inputProps.loading}
    />
  );
}

export type InputFieldRHFProps = InputProps & FieldProps & RHFRegisterProps;

export function InputFieldRHF(props: InputFieldRHFProps) {
  const {
    defaultValue,
    onChange: inputOnChange,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    ...otherInputProps
  } = props;
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();
  const error = get(errors, props.name);
  const rhfProps = register(props.name, {
    setValueAs:
      props.type === 'number'
        ? (value: string | number) => {
            // setValueAs also receives the default value, which should normally be a number
            if (typeof value === 'number') {
              return value;
            }

            if (!value) return undefined;
            return Number(value);
          }
        : undefined,
    ...rhfOptions,
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
