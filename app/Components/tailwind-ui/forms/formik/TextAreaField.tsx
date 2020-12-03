import { useField } from 'formik';
import React from 'react';

import { TextArea, TextAreaProps } from '../basic/TextArea';

export type TextAreaFieldProps = TextAreaProps;

export function TextAreaField(props: TextAreaFieldProps): JSX.Element {
  const [field, meta] = useField(props);
  return (
    <TextArea
      {...props}
      {...field}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
