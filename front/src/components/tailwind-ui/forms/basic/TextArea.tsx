import clsx from 'clsx';
import React, { forwardRef, ReactNode, Ref } from 'react';

import { inputColor, inputError, Label, Help, InputCorner } from './common';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error?: string;
  label: string;
  hiddenLabel?: boolean;
  help?: string;
  textAreaClassName?: string;
  /**
   * Custom react node to display in the upper right corner of the input
   */
  corner?: ReactNode;
}

export const TextArea = forwardRef(function TextAreaForwardRef(
  props: TextAreaProps,
  ref: Ref<HTMLTextAreaElement>,
) {
  const {
    name,
    id = name,
    className,
    error,
    label,
    hiddenLabel = false,
    corner,
    help,
    textAreaClassName,
    rows = 5,
    ...otherProps
  } = props;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <Label
          id={id}
          text={label}
          hidden={hiddenLabel}
          required={props.required}
          disabled={props.disabled}
        />
        <InputCorner>{corner}</InputCorner>
      </div>
      <div
        className={clsx('flex', {
          'mt-1': !hiddenLabel || corner,
        })}
      >
        <textarea
          ref={ref}
          id={id}
          name={name}
          className={clsx(
            'form-textarea block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm',
            {
              [inputColor]: !error,
              [inputError]: error,
            },
            textAreaClassName,
          )}
          rows={rows}
          {...otherProps}
        />
      </div>
      <Help error={error} help={help} />
    </div>
  );
});
