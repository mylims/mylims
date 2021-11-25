import clsx from 'clsx';
import React, { Children, forwardRef, Ref } from 'react';

import type { GroupOptionProps, OptionProps } from '../GroupOption';
import { Label } from '../common';

export const Option = forwardRef(function OptionForwardRef(
  props: OptionProps,
  ref: Ref<HTMLInputElement>,
) {
  const { label, description, name, id, value, checked, ...otherProps } = props;
  return (
    <label htmlFor={id}>
      <div
        className={clsx('p-4 flex', {
          'bg-primary-50 border-primary-200 z-10': checked,
        })}
      >
        <div className="flex items-center h-5">
          <input
            type="radio"
            ref={ref}
            name={name}
            value={value}
            id={id}
            className="w-4 h-4 cursor-pointer border-neutral-300 focus:ring-primary-500 text-primary-600"
            checked={checked}
            {...otherProps}
          />
        </div>
        <label htmlFor={id} className="flex flex-col ml-3 cursor-pointer">
          <span
            className={clsx('block text-sm font-semibold', {
              'text-neutral-900': !checked && !props.disabled,
              'text-primary-900': checked,
              'text-neutral-500': props.disabled,
            })}
          >
            {label}
          </span>
          <span
            className={clsx('block text-sm', {
              'text-neutral-500': !checked,
              'text-primary-700': checked,
            })}
          >
            {description}
          </span>
        </label>
      </div>
    </label>
  );
});

export function GroupOption(props: GroupOptionProps): JSX.Element {
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
