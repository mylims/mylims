import { XIcon } from '@heroicons/react/outline';
import React, { useCallback } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useController, useFormContext } from 'react-hook-form';

import { Input } from '../basic/Input';
import { DatePickerFieldProps } from '../formik/DatePickerField';
import { defaultErrorSerializer, FieldProps } from '../util';

if (typeof window !== 'undefined') {
  // @ts-ignore
  void import('react-datepicker/dist/react-datepicker.css');
}

export function DatePickerFieldRHF<Modifiers extends string = never>(
  props: DatePickerFieldProps<Modifiers> & FieldProps,
) {
  const {
    isClearable,
    name,
    label,
    inputProps,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;
  const { setValue } = useFormContext();
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
    },
    [setValue, name, isSubmitted],
  );

  return (
    <div className="flex">
      <ReactDatePicker
        selected={value}
        // We do not allow ranges because the callback would not receive a Date
        selectsRange={false}
        customInput={
          <Input
            {...inputProps}
            ref={ref}
            name={name}
            label={label}
            error={serializeError(error)}
            trailingInlineAddon={
              value && props.isClearable ? (
                <XIcon
                  className="w-3.5 h-3.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setFieldValue(null);
                  }}
                />
              ) : null
            }
          />
        }
        onChange={(date: Date | null) => {
          setFieldValue(date);
        }}
        onBlur={onBlur}
        wrapperClassName="flex-1"
        popperPlacement="bottom-start"
        showPopperArrow={false}
        name={name}
        // This is required to prevent react-date-picker from overriding
        // the ref passed to the custom input
        customInputRef="datePickerRef"
        {...otherProps}
      />
    </div>
  );
}
