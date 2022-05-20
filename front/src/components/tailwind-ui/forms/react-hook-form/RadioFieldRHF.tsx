import React from 'react';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { Radio, RadioProps } from '../basic/Radio';
import { RHFRegisterProps } from '../util';

export type RadioFieldProps = RadioProps;

export function RadioFieldRHF(
  props: RadioFieldProps & RHFRegisterProps,
): JSX.Element {
  const { rhfOptions, ...otherProps } = props;
  const { register } = useCheckedFormRHFContext();

  return <Radio {...otherProps} {...register(props.name, rhfOptions)} />;
}
