import { useField } from 'formik';
import React from 'react';

import { RadioProps, Radio } from '../basic/Radio';

export type RadioFieldProps = RadioProps;

export function RadioField(props: RadioFieldProps): JSX.Element {
  const [field] = useField({ ...props, type: 'radio' });
  return <Radio {...props} {...field} />;
}
