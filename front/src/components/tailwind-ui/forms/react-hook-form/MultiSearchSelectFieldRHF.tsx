import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { MultiSearchSelect } from '../basic/MultiSearchSelect';
import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import {
  MultiSearchSelectFieldProps,
  SimpleMultiSearchSelectFieldProps,
} from '../formik/MultiSearchSelectField';
import { defaultErrorSerializer } from '../util';

export function MultiSearchSelectFieldRHF<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleMultiSearchSelectFieldProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleMultiSearchSelectFieldProps<OptionType>
    : MultiSearchSelectFieldProps<OptionType>,
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    ...otherProps
  } = props;

  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: props.name,
  });

  const handleSelect = useCallback(
    (options: OptionType[]) => {
      setValue(name, options, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, isSubmitted, name, trigger, deps],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <MultiSearchSelect<any>
      name={name}
      ref={field.ref}
      onBlur={field.onBlur}
      {...otherProps}
      error={serializeError(error)}
      selected={field.value}
      onSelect={handleSelect}
    />
  );
}
