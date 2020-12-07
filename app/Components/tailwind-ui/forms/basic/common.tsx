import clsx from 'clsx';
import React from 'react';

export const labelColor = 'text-neutral-700';
export const labelDisabledColor = 'text-neutral-500';
export const helpColor = 'text-neutral-400';
export const hintColor = 'text-neutral-500';
export const inputColor =
  'focus-within:ring-primary-500 focus-within:border-primary-500 border-neutral-300 disabled:bg-neutral-50 disabled:text-neutral-500';
export const inputError =
  'border-danger-300 text-danger-900 placeholder-danger-500 focus-within:border-danger-500 focus-within:ring-danger-500';

export interface LabelProps {
  id: string;
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
        'block text-sm font-medium',
        props.disabled ? labelDisabledColor : labelColor,
        props.hidden && 'sr-only',
      )}
    >
      {props.text}
      {props.required && <span className="text-warning-600"> *</span>}
    </label>
  );
}

export function Help(props: { text: string }) {
  return <p className={clsx('mt-2 text-sm', helpColor)}>{props.text}</p>;
}

export function Error(props: { text: string }) {
  return <p className="mt-2 text-sm text-danger-600">{props.text}</p>;
}

export function Hint(props: { text: string }) {
  return <span className={clsx('text-sm', hintColor)}>{props.text}</span>;
}
