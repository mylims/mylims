import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import { Help, inputColor, InputCorner, inputError, Label } from './common';

if (typeof window !== 'undefined') {
  // @ts-ignore
  void import('react-datepicker/dist/react-datepicker.css');
}

type OnChangeCallback = (date: Date | null) => void;

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'required'
>;

export type DatePickerProps<Modifiers extends string = never> = Omit<
  ReactDatePickerProps<Modifiers>,
  | 'selected'
  | 'wrapperClassName'
  | 'onChange'
  | 'selectsRange'
  | 'customInput'
  | 'value'
  | 'showPopperArrow'
  | 'popperPlacement'
> & {
  value: Date | null;
  onChange: OnChangeCallback;

  name: string;
  label: string;
  error?: string;
  hiddenLabel?: boolean;
  help?: string;
  corner?: ReactNode;

  inputRef?: Ref<HTMLInputElement>;
  inputProps?: InputProps;
};

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    onChange,

    name,
    label,
    error,
    hiddenLabel,
    help,
    corner,

    inputRef,
    inputProps,

    id = name,
    isClearable,
    className,
    ...otherProps
  } = props;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <Label
          id={id}
          text={label}
          hidden={hiddenLabel}
          required={props.required}
          disabled={props.disabled}
        />
        <InputCorner>{corner}</InputCorner>
      </div>
      <ReactDatePicker
        id={id}
        selected={value}
        wrapperClassName={clsx('flex relative', {
          'mt-1': !hiddenLabel || corner,
        })}
        // We do not allow ranges because the callback would not receive a Date
        selectsRange={false}
        customInput={
          <DatePickerInput
            name={name}
            error={error}
            inputRef={inputRef}
            inputProps={inputProps}
            isClearable={isClearable}
            selected={value}
            onSelectChange={onChange}
          />
        }
        onChange={onChange}
        popperPlacement="bottom-start"
        // Arrow is broken and won't work if set
        showPopperArrow={false}
        {...otherProps}
      />
      <Help error={error} help={help} />
    </div>
  );
}

interface DatePickerInputProps {
  name: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  inputProps?: InputProps;
  isClearable?: boolean;
  selected: Date | null;
  onSelectChange: OnChangeCallback;
}

const DatePickerInput = forwardRef(function DatePickerInput(
  {
    inputRef,
    inputProps,
    name,
    error,
    selected,
    isClearable,
    onSelectChange,
    // Other props to control the input (such as id, value) are passed by react-datepicker
    ...otherProps
  }: DatePickerInputProps,
  ref: Ref<HTMLInputElement>,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
  useImperativeHandle(inputRef, () => innerRef.current as HTMLInputElement);
  return (
    <div className="relative">
      <input
        {...otherProps}
        {...inputProps}
        autoComplete="off"
        ref={innerRef}
        name={name}
        className={clsx(
          'form-input block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm',
          {
            [inputColor]: !error,
            [inputError]: error,
          },
          inputProps?.className,
        )}
      />
      {selected && isClearable ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <XIcon
            className="h-3.5 w-3.5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSelectChange?.(null);
            }}
          />
        </div>
      ) : null}
    </div>
  );
});
