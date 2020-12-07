import clsx from 'clsx';
import React from 'react';

import { helpColor, labelColor, labelDisabledColor } from './common';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  help?: string;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const {
    name,
    value = 'no-value',
    id = `${name}-${String(value)}`,
    label,
    help,
    className,
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
          className="w-4 h-4 rounded focus:ring-primary-500 border-neutral-300 text-primary-600 disabled:text-neutral-300"
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className={clsx(
            'font-medium',
            props.disabled ? labelDisabledColor : labelColor,
          )}
        >
          {label}
        </label>
        {help && <p className={helpColor}>{help}</p>}
      </div>
    </div>
  );
}
