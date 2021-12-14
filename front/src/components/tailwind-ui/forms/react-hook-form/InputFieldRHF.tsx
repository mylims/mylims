import React, { ChangeEvent, useCallback } from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { useInputAsyncValidation } from '../../hooks/useInputAsyncValidationHook';
import { InputProps, Input } from '../basic/Input';
import { AsyncInputFieldProps } from '../formik/InputField';
import { defaultErrorSerializer, FieldProps, RHFRegisterProps } from '../util';

type EmptyValue = string | number | null;
interface InputFieldRHFCustomProps {
  /**
   * State value when user enters an empty value in the input
   * This option is ignored if setValueAs is set in rhfOptions
   */
  emptyValue?: EmptyValue;
}

function getSetValueAs(emptyValue: EmptyValue, type: InputProps['type']) {
  if (type === 'number') {
    return getSetValueAsNumber(emptyValue);
  } else {
    return getSetValueAsString(emptyValue);
  }
}

export type AsyncInputFieldRHFProps = AsyncInputFieldProps &
  FieldProps &
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
    emptyValue = null,
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
      {...register(props.name, {
        setValueAs: getSetValueAs(emptyValue, props.type),
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
  RHFRegisterProps &
  InputFieldRHFCustomProps;

export function InputFieldRHF(props: InputFieldRHFProps) {
  const {
    defaultValue,
    onChange: inputOnChange,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    emptyValue = null,
    ...otherInputProps
  } = props;
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();
  const error = get(errors, props.name);
  const rhfProps = register(props.name, {
    setValueAs: getSetValueAs(emptyValue, props.type),
    ...rhfOptions,
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

function getSetValueAsNumber(emptyValue: EmptyValue) {
  return function setValueAsNumber(value: string | number) {
    // setValueAs also receives the default value, which should normally be a number
    if (typeof value === 'number') {
      return value;
    }

    if (!value) return emptyValue;
    return Number(value);
  };
}

function getSetValueAsString(emptyValue: EmptyValue) {
  if (emptyValue === undefined) return undefined;
  return function setValueAsString(value: string) {
    if (!value) return emptyValue;
    return value;
  };
}
