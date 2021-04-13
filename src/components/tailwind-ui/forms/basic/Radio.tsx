import clsx from 'clsx';
import React from 'react';

import { helpColor, labelColor, labelDisabledColor } from './common';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  value: string;
  help?: string;
}

export function Radio(props: RadioProps): JSX.Element {
  const {
    name,
    value,
    id = `${name}-${value}`,
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
          type="radio"
          className="w-4 h-4 focus:ring-primary-500 border-neutral-300 text-primary-600 disabled:text-neutral-300"
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className={clsx(
            'block font-semibold',
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
