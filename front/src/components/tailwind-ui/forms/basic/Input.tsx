import clsx from 'clsx';
import React, { forwardRef, ReactNode, Ref } from 'react';

import { Spinner } from '../../elements/spinner/Spinner';

import {
  inputColor,
  inputError,
  inputValid,
  Label,
  Help,
  InputCorner,
  InputErrorIcon,
  InputValidIcon,
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
  help?: string;
  inlinePlaceholder?: ReactNode;
  inputClassName?: string;
  /**
   * Custom react node to display in the upper right corner of the input
   */
  corner?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    CustomInputProps {
  name: string;
  /**
   * Ref for the <div> wrapping the <input> element.
   */
  wrapperRef?: Ref<HTMLDivElement>;
}

export const Input = forwardRef(function InputForwardRef(
  props: InputProps,
  ref: Ref<HTMLInputElement>,
) {
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
    corner,
    hiddenLabel = false,
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

      <div
        ref={wrapperRef}
        className={clsx('flex rounded-md shadow-sm', {
          'mt-1': !hiddenLabel || corner,
        })}
      >
        {leadingAddon && <LeadingAddon value={leadingAddon} />}
        <label
          htmlFor={id}
          className={clsx(
            'bg-white border py-2 px-3 focus-within:ring-1',
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
                'flex-1 focus:outline-none focus:ring-0 sm:text-sm border-none p-0':
                  true,
                'bg-neutral-50 text-neutral-500': props.disabled,
              },
              error
                ? 'placeholder-danger-300'
                : valid
                ? 'placeholder-success-600'
                : 'placeholder-neutral-400',
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
      <Help error={error} valid={valid} help={help} />
    </div>
  );
});

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
