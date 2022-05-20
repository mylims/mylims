import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import {
  MultiSearchSelect,
  MultiSearchSelectProps,
  SimpleMultiSearchSelectProps,
} from '../basic/MultiSearchSelect';
import { SimpleSelectOption } from '../basic/Select';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
} from '../util';

export type MultiSearchSelectFieldProps<OptionType> = Omit<
  MultiSearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error' | 'onBlur'
> &
  FieldProps;

export type SimpleMultiSearchSelectFieldProps<OptionType> = Omit<
  SimpleMultiSearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error' | 'onBlur'
> &
  FieldProps;

export function MultiSearchSelectFieldRHF<OptionType>(
  props: RHFValidationProps &
    (OptionType extends SimpleSelectOption
      ? SimpleMultiSearchSelectFieldProps<OptionType>
      : MultiSearchSelectFieldProps<OptionType>),
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    ...otherProps
  } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: props.name,
  });

  const handleSelect = useCallback(
    (options: OptionType[]) => {
      setValue(name, options, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, isSubmitted, name, trigger, deps],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <MultiSearchSelect<any>
      name={name}
      ref={field.ref}
      onBlur={field.onBlur}
      {...otherProps}
      error={serializeError(error)}
      selected={field.value}
      onSelect={handleSelect}
    />
  );
}
