import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

export const labelColor = 'text-neutral-700';
export const labelDisabledColor = 'text-neutral-500';
export const inputColor =
  'placeholder-neutral-400 focus-within:ring-primary-500 focus-within:border-primary-500 border-neutral-300 disabled:bg-neutral-50 disabled:text-neutral-500';
export const inputError =
  'border-danger-300 text-danger-900 placeholder-danger-300 focus-within:border-danger-500 focus-within:ring-danger-500';
export const inputValid =
  'border-success-400 text-success-900 placeholder-success-600 focus-within:border-success-600 focus-within:ring-success-600';
export interface LabelProps {
  id?: string;
  text: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function Label(props: LabelProps) {
  return (
    <label
      htmlFor={props.id}
      className={clsx(
        'block text-sm font-semibold',
        props.disabled ? labelDisabledColor : labelColor,
        props.hidden && 'sr-only',
      )}
    >
      {props.text}
      {props.required && <span className="text-warning-600"> *</span>}
    </label>
  );
}

const helpColorMap = {
  error: 'text-danger-600',
  valid: 'text-success-700',
  help: 'text-neutral-500',
};

export function Help(props: {
  error?: string;
  valid?: string | boolean;
  help?: string;
  noMargin?: boolean;
}) {
  const { error, valid, help, noMargin } = props;
  if (!error && !(typeof valid === 'string') && !help) {
    return null;
  }

  let toDisplay = error
    ? ({ type: 'error', value: error } as const)
    : typeof valid === 'string'
    ? ({ type: 'valid', value: valid } as const)
    : ({ type: 'help', value: help } as const);

  return (
    <p
      className={clsx(
        'text-sm whitespace-pre-line',
        helpColorMap[toDisplay.type],
        !noMargin && 'mt-2',
      )}
    >
      {toDisplay.value}
    </p>
  );
}

export function InputCorner(props: { children: ReactNode }) {
  return <div className="text-sm">{props.children}</div>;
}

export function InputErrorIcon() {
  return <ExclamationCircleIcon className="w-5 h-5 ml-2 text-danger-500" />;
}

export function InputValidIcon() {
  return <CheckIcon className="w-5 h-5 ml-2 text-success-600" />;
}
