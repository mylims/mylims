import clsx from 'clsx';
import React, { ReactNode, Ref } from 'react';

import { Spinner } from '../../elements/spinner/Spinner';
import {
  SvgSolidCheck,
  SvgSolidExclamationCircle,
} from '../../svg/heroicon/solid';
import { forwardRefWithAs } from '../../util';

import {
  Error,
  Help,
  Hint,
  inputColor,
  inputError,
  inputValid,
  Label,
  Valid,
} from './common';

export interface CustomInputProps {
  error?: string;
  valid?: boolean | string;
  leadingAddon?: ReactNode;
  leadingInlineAddon?: ReactNode;
  trailingAddon?: ReactNode;
  trailingInlineAddon?: ReactNode;
  loading?: boolean;
  label: string;
  hiddenLabel?: boolean;
  hint?: string;
  help?: string;
  inlinePlaceholder?: ReactNode;
  inputClassName?: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    CustomInputProps {
  name: string;
  /**
   * Ref for the <input> element.
   */
  ref?: Ref<HTMLInputElement>;
  /**
   * Ref for the <div> wrapping the <input> element.
   */
  wrapperRef?: Ref<HTMLDivElement>;
}

export const Input = forwardRefWithAs(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const {
      name,
      id = name,
      className,
      style,
      error,
      valid,
      leadingAddon,
      leadingInlineAddon,
      trailingAddon,
      trailingInlineAddon,
      loading,
      label,
      hiddenLabel = false,
      hint,
      help,
      placeholder,
      inlinePlaceholder,
      wrapperRef,
      type = 'text',
      inputClassName,
      ...otherProps
    } = props;

    return (
      <div className={className}>
        <div className="flex justify-between">
          <Label
            id={id}
            text={label}
            hidden={hiddenLabel}
            required={props.required}
            disabled={props.disabled}
          />
          {hint && <Hint text={hint} />}
        </div>
        <div ref={wrapperRef} className="flex mt-1 rounded-md shadow-sm">
          {leadingAddon && <LeadingAddon value={leadingAddon} />}
          <label
            htmlFor={id}
            className={clsx(
              'bg-white border py-2 px-3 focus-within:ring-1 placeholder-neutral-500 placeholder-opacity-100',
              'flex-1 flex flex-row items-center relative text-base sm:text-sm shadow-sm',
              {
                [inputColor]: !error,
                [inputError]: error,
                [inputValid]: valid,
                'rounded-r-md': leadingAddon && !trailingAddon,
                'rounded-l-md': trailingAddon && !leadingAddon,
                'rounded-md': !leadingAddon && !trailingAddon,
                'bg-neutral-50 text-neutral-500': props.disabled,
              },
            )}
            style={style}
          >
            {leadingInlineAddon && (
              <LeadingInlineAddon value={leadingInlineAddon} />
            )}
            {inlinePlaceholder && (
              <div className="absolute pointer-events-none">
                {inlinePlaceholder}
              </div>
            )}
            <input
              ref={ref}
              id={id}
              name={name}
              placeholder={
                placeholder && !inlinePlaceholder ? placeholder : undefined
              }
              className={clsx(
                {
                  'flex-1 focus:outline-none focus:ring-0 sm:text-sm border-none p-0': true,
                  'bg-neutral-50 text-neutral-500': props.disabled,
                },
                inputClassName,
              )}
              type={type}
              {...otherProps}
            />
            <div className="inline-flex flex-row items-center space-x-1 cursor-default">
              {loading && <Spinner className="w-5 h-5 text-neutral-400" />}
              {trailingInlineAddon && (
                <TrailingInlineAddon value={trailingInlineAddon} />
              )}
            </div>
            {error && <InputErrorIcon />}
            {valid && <InputValidIcon />}
          </label>
          {trailingAddon && <TrailingAddon value={trailingAddon} />}
        </div>
        {error ? (
          <Error text={error} />
        ) : valid && typeof valid === 'string' ? (
          <Valid text={valid} />
        ) : (
          help && <Help text={help} />
        )}
      </div>
    );
  },
);

function InputErrorIcon() {
  return <SvgSolidExclamationCircle className="w-5 h-5 ml-2 text-danger-500" />;
}

function InputValidIcon() {
  return <SvgSolidCheck className="w-5 h-5 ml-2 text-success-600" />;
}

function LeadingInlineAddon(props: { value: ReactNode }) {
  return (
    <div className="flex items-center pr-2 text-neutral-500 sm:text-sm">
      {props.value}
    </div>
  );
}

function TrailingInlineAddon(props: { value: ReactNode }) {
  return (
    <div className={clsx('flex items-center pl-2 text-neutral-500 sm:text-sm')}>
      {props.value}
    </div>
  );
}

function LeadingAddon(props: { value: ReactNode }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center text-neutral-500 border border-r-0 border-neutral-300 rounded-l-md bg-neutral-50 sm:text-sm',
        typeof props.value === 'string' && 'px-3',
      )}
    >
      {props.value}
    </div>
  );
}

function TrailingAddon(props: { value: ReactNode }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center text-neutral-500 border border-l-0 border-neutral-300 rounded-r-md bg-neutral-50 sm:text-sm',
        typeof props.value === 'string' && 'px-3',
      )}
    >
      {props.value}
    </div>
  );
}
