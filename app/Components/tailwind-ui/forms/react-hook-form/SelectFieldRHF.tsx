import React from 'react';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import {
  Select,
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import {
  SelectFieldProps,
  SimpleSelectFieldProps,
} from '../formik/SelectField';
import {
  defaultErrorSerializer,
  RHFControllerProps,
  RHFValidationProps,
} from '../util';

export function SelectFieldRHF<OptionType>(
  props: RHFControllerProps &
    RHFValidationProps &
    (OptionType extends SimpleStringSelectOption
      ? SimpleSelectFieldProps<OptionType>
      : OptionType extends SimpleNumberSelectOption
      ? SimpleSelectFieldProps<OptionType>
      : SelectFieldProps<OptionType>),
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    rhfOptions,
    ...selectProps
  } = props;
  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: props.name,
    ...rhfOptions,
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Select<any>
      selected={field.value}
      onSelect={(option: OptionType | undefined) => {
        setValue(name, option || null, {
          shouldValidate: isSubmitted,
          shouldTouch: true,
        });
        if (deps && isSubmitted) {
          void trigger(deps);
        }
      }}
      error={serializeError(error)}
      {...selectProps}
    />
  );
}
