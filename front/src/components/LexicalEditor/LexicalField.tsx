import clsx from 'clsx';
import React, { CSSProperties } from 'react';

import LexicalEditor, { LexicalEditorProps } from '@/components/LexicalEditor';
import {
  Help,
  inputColor,
  inputError,
  inputValid,
  Label,
} from '@/components/tailwind-ui/forms/basic/common';

export interface LexicalFieldProps extends LexicalEditorProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  name: string;
  label: string;
  hiddenLabel?: boolean;
  required?: boolean;
  error?: string;
  help?: string;
  valid?: boolean | string;
}
export function LexicalField({
  value,
  onChange,
  className,
  style,
  name,
  id = name,
  hiddenLabel,
  label,
  required,
  error,
  valid,
  help,
}: LexicalFieldProps) {
  return (
    <div className={className} style={style}>
      <div className="flex items-baseline justify-between gap-2">
        <Label id={id} text={label} hidden={hiddenLabel} required={required} />
      </div>
      <div
        className={clsx(
          'h-full rounded-md border px-3 py-2 shadow-sm focus-within:ring-1',
          {
            [inputColor]: !error,
            [inputError]: error,
            [inputValid]: valid,
          },
        )}
      >
        <LexicalEditor value={value} onChange={onChange} />
      </div>
      <Help error={error} valid={valid} help={help} />
    </div>
  );
}
