import clsx from 'clsx';
import React, { forwardRef, Ref } from 'react';

import { Help, labelColor, labelDisabledColor } from './common';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  value: string;
  help?: string;
}

export const Radio = forwardRef(function RadioForwardRef(
  props: RadioProps,
  ref: Ref<HTMLInputElement>,
) {
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
      <div className="flex h-5 items-center">
        <input
          {...otherProps}
          ref={ref}
          id={id}
          name={name}
          value={value}
          type="radio"
          className="form-radio h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500 disabled:text-neutral-300"
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
        <Help help={help} noMargin />
      </div>
    </div>
  );
});
