import clsx from 'clsx';
import React, { Children, forwardRef, Ref } from 'react';

import type { GroupOptionProps } from '../GroupOption';
import { Label } from '../common';

export interface OptionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  id: string;
  description?: string;
}

export const Option = forwardRef(function OptionForwardRef(
  props: OptionProps,
  ref: Ref<HTMLInputElement>,
) {
  const { name, label, id, description, value, checked, ...otherProps } = props;
  return (
    <label htmlFor={id}>
      <div
        className={clsx('flex p-4', {
          'z-10 border-primary-200 bg-primary-50': checked,
        })}
      >
        <div className="flex h-5 items-center">
          <input
            type="radio"
            ref={ref}
            name={name}
            value={value}
            id={id}
            className="h-4 w-4 cursor-pointer border-neutral-300 text-primary-600 focus:ring-primary-500"
            checked={checked}
            {...otherProps}
          />
        </div>
        <label htmlFor={id} className="ml-3 flex cursor-pointer flex-col">
          <span
            className={clsx('block text-sm font-semibold', {
              'text-neutral-900': !checked && !props.disabled,
              'text-primary-900': checked,
              'text-neutral-500': props.disabled,
            })}
          >
            {label}
          </span>
          {description && (
            <span
              className={clsx('block text-sm', {
                'text-neutral-500': !checked,
                'text-primary-700': checked,
              })}
            >
              {description}
            </span>
          )}
        </label>
      </div>
    </label>
  );
});

export function GroupOptionInternal(props: GroupOptionProps): JSX.Element {
  const lastChildIndex = Children.count(props.children) - 1;

  return (
    <div>
      {props.label && (
        <Label
          text={props.label}
          disabled={props.disabled}
          required={props.required}
          hidden={props.hiddenLabel}
        />
      )}
      <div className={clsx({ 'mt-1': !props.hiddenLabel })}>
        {Children.map(props.children, (child, index) => {
          return (
            <div
              key={child.props.id}
              className={clsx('border border-neutral-200', {
                'rounded-tl-md rounded-tr-md': index === 0,
                'border-b-0': index !== lastChildIndex,
                'rounded-bl-md rounded-br border-b': index === lastChildIndex,
              })}
            >
              {props.disabled === true
                ? React.cloneElement(child, {
                    disabled: props.disabled,
                  })
                : child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
