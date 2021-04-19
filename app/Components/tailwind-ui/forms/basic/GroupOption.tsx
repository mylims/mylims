import clsx from 'clsx';
import { useField } from 'formik';
import React, { Children, cloneElement, ReactElement } from 'react';

import { Error as ErrorComponent, Label } from './common';

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

export function GroupOption(props: GroupOptionProps) {
  Children.forEach(props.children, (child) => {
    if (child.type !== Option) {
      throw new Error(
        'GroupOption expects children to be GroupOption.Option components only',
      );
    }
  });
  return <GroupOptionInternal {...props} />;
}

function GroupOptionInternal(props: GroupOptionProps): JSX.Element {
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

export function GroupOptionField(
  props: GroupOptionProps & {
    name: string;
  },
) {
  const [, meta] = useField(props.name);
  const childrenWithName = Children.map(props.children, (child) => {
    if (child.type !== OptionField) {
      throw new Error(
        'GroupOptionField expects children to be GroupOptionField.Option components only',
      );
    }
    return cloneElement(child, { name: props.name });
  });
  return (
    <div>
      <GroupOptionInternal {...props} children={childrenWithName} />
      {meta.touched && meta.error && <ErrorComponent text={meta.error} />}
    </div>
  );
}

function Option(props: OptionProps): JSX.Element {
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
}

export function OptionField(props: OptionProps): JSX.Element {
  const [field] = useField({ ...props, type: 'radio' });
  return <Option {...props} {...field} />;
}

GroupOptionField.Option = OptionField as (
  props: Omit<OptionProps, 'name'>,
) => JSX.Element;

GroupOption.Option = Option;
