import React from 'react';

import { useDropzoneField } from '../../hooks/useDropzone';

import { Dropzone, DropzoneProps } from './Dropzone';
import { DropzoneList } from './DropzoneList';
import { Error, Label } from './common';

export interface DropzoneFieldProps extends Omit<DropzoneProps, 'onDrop'> {
  name: string;
  label: string;
  required?: boolean;
  showList?: boolean;
  replace?: boolean;
}

export function DropzoneField(props: DropzoneFieldProps) {
  const {
    message,
    header,
    name,
    label,
    required,
    disabled,
    ...otherProps
  } = props;
  const {
    dropzoneProps,
    dropzoneListProps,
    field,
    meta,
  } = useDropzoneField(otherProps, { name });

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
      {meta.touched && meta.error && <Error text={meta.error} />}
    </div>
  );
}
