import clsx from 'clsx';
import React, { Ref } from 'react';

import { forwardRefWithAs } from '../../util';

import { Error, Help, Hint, inputColor, inputError, Label } from './common';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error?: string;
  label: string;
  hiddenLabel?: boolean;
  hint?: string;
  help?: string;

  ref?: Ref<HTMLTextAreaElement>;
}

export const TextArea = forwardRefWithAs(
  (props: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
    const {
      name,
      id = name,
      className,
      error,
      label,
      hiddenLabel = false,
      hint,
      help,
      ...otherProps
    } = props;
    return (
      <div className={className}>
        <div className="flex justify-between">
          <Label
            id={id}
            text={label}
            hidden={hiddenLabel}
            required={props.required}
            disabled={props.disabled}
          />
          {hint && <Hint text={hint} />}
        </div>
        <div className="flex mt-1">
          <textarea
            ref={ref}
            id={id}
            name={name}
            className={clsx(
              'shadow-sm block w-full sm:text-sm border-neutral-300 rounded-md',
              {
                [inputColor]: !error,
                [inputError]: error,
              },
            )}
            {...otherProps}
          />
        </div>
        {error ? <Error text={error} /> : help && <Help text={help} />}
      </div>
    );
  },
);
