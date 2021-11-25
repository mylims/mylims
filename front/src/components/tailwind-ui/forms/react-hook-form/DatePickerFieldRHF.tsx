import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import { DatePicker, DatePickerProps } from '../..';
import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFControlledProps,
} from '../util';

export function DatePickerFieldRHF(
  props: Omit<DatePickerProps, 'value' | 'onChange'> &
    FieldProps &
    RHFControlledProps,
) {
  const {
    name,
    inputProps,
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
  const { value, onBlur, ref } = field;

  const setFieldValue = useCallback(
    (value: Date | null) => {
      setValue(name, value, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, name, isSubmitted, deps, trigger],
  );

  return (
    <div className="flex">
      <DatePicker
        value={value}
        name={name}
        inputProps={{
          ...inputProps,
        }}
        inputRef={ref}
        error={serializeError(error)}
        onChange={(date: Date | null) => {
          setFieldValue(date);
        }}
        onBlur={onBlur}
        // This is required to prevent react-date-picker from overriding
        // the ref passed to the custom input
        customInputRef="datePickerRef"
        {...otherProps}
      />
    </div>
  );
}
