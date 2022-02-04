import clsx from 'clsx';
import React, { forwardRef, Ref } from 'react';

import { Help, labelColor, labelDisabledColor } from './common';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  help?: string;
  error?: string;
}

export const Checkbox = forwardRef(function CheckboxForwardRef(
  props: CheckboxProps,
  ref: Ref<HTMLInputElement>,
) {
  const {
    name,
    value,
    id = `${name}-${String(value)}`,
    label,
    help,
    className,
    error,
    ...otherProps
  } = props;
  return (
    <div className={clsx('flex items-start', className)}>
      <div className="flex h-5 items-center">
        <input
          {...otherProps}
          id={id}
          name={name}
          value={value}
          type="checkbox"
          ref={ref}
          className={clsx(
            'form-checkbox h-4 w-4 rounded text-primary-600 disabled:text-neutral-300',
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
        <Help error={error} help={help} noMargin />
      </div>
    </div>
  );
});
