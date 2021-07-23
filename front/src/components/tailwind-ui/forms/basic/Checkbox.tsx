import clsx from 'clsx';
import React from 'react';

import { Error, helpColor, labelColor, labelDisabledColor } from './common';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  help?: string;
  error?: string;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    name,
    value = 'no-value',
    id = `${name}-${String(value)}`,
    label,
    help,
    className,
    error,
    ...otherProps
  } = props;
  return (
    <div className={clsx('flex items-start', className)}>
      <div className="flex items-center h-5">
        <input
          {...otherProps}
          id={id}
          name={name}
          value={value}
          type="checkbox"
          className={clsx(
            'w-4 h-4 rounded form-checkbox text-primary-600 disabled:text-neutral-300',
            error
              ? 'border-danger-300 focus:ring-danger-500'
              : 'border-neutral-300 focus:ring-primary-500',
          )}
        />
      </div>

      <div className="ml-3 text-sm">
        {label && (
          <label
            htmlFor={id}
            className={clsx(
              'font-semibold',
              props.disabled ? labelDisabledColor : labelColor,
            )}
          >
            {label}
          </label>
        )}

        {help && !error && <p className={helpColor}>{help}</p>}
        {error && <Error text={error} />}
      </div>
    </div>
  );
}
