import { XIcon } from '@heroicons/react/outline';
import { useField } from 'formik';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import { CustomInputProps, Input } from '../basic/Input';

if (typeof window !== 'undefined') {
  // @ts-ignore
  void import('react-datepicker/dist/react-datepicker.css');
}

export type DatePickerFieldProps = Omit<
  ReactDatePickerProps,
  'selected' | 'onChange' | 'onBlur' | 'selectsRange' | 'customInput'
> & {
  name: string;
  label: string;
  inputProps?: Omit<CustomInputProps, 'label'>;
};

export function DatePickerField(props: DatePickerFieldProps) {
  const { isClearable, name, label, inputProps, ...otherProps } = props;
  const [field, meta, handler] = useField<Date | null>(props.name);
  const { value, onBlur } = field;
  return (
    <div className="flex">
      <ReactDatePicker
        selected={value}
        // We do not allow ranges because the callback would not receive a Date
        selectsRange={false}
        customInput={
          <Input
            {...inputProps}
            name={name}
            label={label}
            error={meta.touched ? meta.error : undefined}
            trailingInlineAddon={
              value && props.isClearable ? (
                <XIcon
                  className="w-3.5 h-3.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handler.setValue(null);
                  }}
                />
              ) : null
            }
          />
        }
        onChange={(date: Date | null) => {
          handler.setValue(date);
        }}
        onBlur={(e) => {
          onBlur(e);
        }}
        wrapperClassName="flex-1"
        popperPlacement="bottom-start"
        showPopperArrow={false}
        name={name}
        {...otherProps}
      />
    </div>
  );
}
