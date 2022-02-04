import React from 'react';

import { useDropzoneFieldRHF } from '../../hooks/useDropzone';
import { Dropzone } from '../basic/Dropzone';
import { DropzoneList } from '../basic/DropzoneList';
import { Help, Label } from '../basic/common';
import { DropzoneFieldProps } from '../formik/DropzoneField';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFControllerProps,
  RHFValidationProps,
} from '../util';

export type DropzoneFieldRHFProps = DropzoneFieldProps &
  FieldProps &
  RHFValidationProps &
  RHFControllerProps;

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
