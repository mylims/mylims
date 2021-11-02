import React from 'react';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { Radio } from '../basic/Radio';
import { RadioFieldProps } from '../formik/RadioField';
import { RHFRegisterProps } from '../util';

export function RadioFieldRHF(
  props: RadioFieldProps & RHFRegisterProps,
): JSX.Element {
  const { rhfOptions, ...otherProps } = props;
  const { register } = useCheckedFormRHFContext();
  return <Radio {...otherProps} {...register(props.name, rhfOptions)} />;
}
