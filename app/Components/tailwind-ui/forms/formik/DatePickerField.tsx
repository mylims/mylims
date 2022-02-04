import { useField } from 'formik';
import React from 'react';

import { DatePicker, DatePickerProps } from '../..';

export type DatePickerFieldProps<Modifiers extends string = never> = Omit<
  DatePickerProps<Modifiers>,
  'onChange' | 'value'
>;

export function DatePickerField(props: DatePickerFieldProps) {
  const { inputProps, ...otherProps } = props;
  const [field, meta, handler] = useField<Date | null>(props.name);
  const { value, onBlur } = field;
  return (
    <div className="flex">
      <DatePicker
        value={value}
        // We do not allow ranges because the callback would not receive a Date
        onChange={handler.setValue}
        inputProps={{
          ...props.inputProps,
        }}
        error={meta.touched ? meta.error : undefined}
        onBlur={(e) => {
          onBlur(e);
        }}
        {...otherProps}
      />
    </div>
  );
}
