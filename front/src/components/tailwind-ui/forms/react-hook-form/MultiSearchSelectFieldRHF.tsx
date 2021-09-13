import React, { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

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
    ...otherProps
  } = props;

  const { setValue } = useFormContext();
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
    },
    [setValue, isSubmitted, name],
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
