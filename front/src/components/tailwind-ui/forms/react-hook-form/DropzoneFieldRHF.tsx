import React from 'react';

import { useDropzoneFieldRHF } from '../../hooks/useDropzone';
import { Dropzone, DropzoneProps } from '../basic/Dropzone';
import { DropzoneList } from '../basic/DropzoneList';
import { Help, Label } from '../basic/common';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
} from '../util';

export type DropzoneFieldRHFProps = DropzoneFieldProps &
  FieldProps &
  RHFValidationProps;

export interface DropzoneFieldProps extends Omit<DropzoneProps, 'onDrop'> {
  name: string;
  label: string;
  required?: boolean;
  showList?: boolean;
  replace?: boolean;
}

export function DropzoneFieldRHF(props: DropzoneFieldRHFProps) {
  const {
    message,
    header,
    name,
    label,
    required,
    disabled,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;
  const { dropzoneProps, dropzoneListProps, field, error } =
    useDropzoneFieldRHF(otherProps, name);
  return (
    <div>
      <Label text={label} required={required} disabled={disabled} />
      <Dropzone
        {...field}
        {...dropzoneProps}
        disabled={disabled}
        message={message}
        header={header}
      />
      {props.showList && <DropzoneList {...dropzoneListProps} />}
      <Help error={serializeError(error)} />
    </div>
  );
}
