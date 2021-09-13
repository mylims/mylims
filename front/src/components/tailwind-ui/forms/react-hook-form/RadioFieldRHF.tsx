import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio } from '../basic/Radio';
import { RadioFieldProps } from '../formik/RadioField';

export function RadioFieldRHF(props: RadioFieldProps): JSX.Element {
  const { register } = useFormContext();
  return <Radio {...props} {...register(props.name)} />;
}
