import clsx from 'clsx';
import React, { ReactElement } from 'react';

import { OptionField } from '../formik/GroupOptionField';

import { Label } from './common';

export interface GroupOptionProps {
  label?: string;
  disabled?: boolean;
  hiddenLabel?: boolean;
  required?: boolean;
  children: ReactElement<OptionProps> | Array<React.ReactElement<OptionProps>>;
}

export interface OptionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  name: string;
  description: string;
}

export function GroupOption(props: GroupOptionProps): JSX.Element {
  const lastChildIndex = Array.isArray(props.children)
    ? props.children.length - 1
    : 0;
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
      <div className="mt-1">
        {React.Children.map(props.children, (child, index) => {
          return (
            <div
              key={child.props.id}
              className={clsx('border border-neutral-200', {
                'rounded-tl-md rounded-tr-md': index === 0,
                'border-b-0': index !== lastChildIndex,
                'rounded-bl-md rounded-br border-b-1': index === lastChildIndex,
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

GroupOption.Option = (props: OptionProps): JSX.Element => {
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
            name={name}
            value={value}
            id={id}
            className="w-4 h-4 border-gray-300 cursor-pointer focus:ring-primary-500 text-primary-600"
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
};

GroupOption.OptionField = OptionField;
