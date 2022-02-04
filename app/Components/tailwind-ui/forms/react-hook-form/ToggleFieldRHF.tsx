import React, { useCallback } from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { Toggle } from '../basic/Toggle';
import { ToggleFieldProps } from '../formik/ToggleField';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

export type ToggleFieldRHFProps = ToggleFieldProps &
  FieldProps &
  RHFValidationProps &
  RHFRegisterProps;

export function ToggleFieldRHF(props: ToggleFieldRHFProps): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    deps,
    ...otherProps
  } = props;
  const {
    setValue,
    trigger,
    register,
    formState: { errors, isSubmitted },
  } = useCheckedFormRHFContext();
  const activated = useWatch({
    name: props.name,
  });

  const error = get(errors, props.name);

  const handleToggle = useCallback(
    (value: boolean) => {
      setValue(name, value, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, name, isSubmitted, deps, trigger],
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
