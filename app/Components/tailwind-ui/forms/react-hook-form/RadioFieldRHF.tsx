import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio } from '../basic/Radio';
import { RadioFieldProps } from '../formik/RadioField';
import { RHFRegisterProps } from '../util';

export function RadioFieldRHF(
  props: RadioFieldProps & RHFRegisterProps,
): JSX.Element {
  const { rhfOptions, ...otherProps } = props;
  const { register } = useFormContext();
  return <Radio {...otherProps} {...register(props.name, rhfOptions)} />;
}
