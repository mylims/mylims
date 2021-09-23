import React, { useCallback } from 'react';
import { get, useFormContext, useWatch } from 'react-hook-form';

import { Toggle } from '../basic/Toggle';
import { ToggleFieldProps } from '../formik/ToggleField';
import { defaultErrorSerializer, FieldProps, RHFRegisterProps } from '../util';

export type ToggleFieldRHFProps = ToggleFieldProps &
  FieldProps &
  RHFRegisterProps;

export function ToggleFieldRHF(props: ToggleFieldRHFProps): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    ...otherProps
  } = props;
  const {
    setValue,
    register,
    formState: { errors, isSubmitted },
  } = useFormContext();
  const activated = useWatch({
    name: props.name,
  });

  const error = get(errors, props.name);

  const handleToggle = useCallback(
    (value: boolean) => {
      return setValue(name, value, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
    },
    [setValue, name, isSubmitted],
  );

  return (
    <Toggle
      onToggle={handleToggle}
      {...register(props.name, rhfOptions)}
      activated={activated}
      error={serializeError(error)}
      {...otherProps}
    />
  );
}
