import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { SearchSelect } from '../basic/SearchSelect';
import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import {
  SearchSelectFieldProps,
  SimpleSearchSelectFieldProps,
} from '../formik/SearchSelectField';
import {
  defaultErrorSerializer,
  RHFControllerProps,
  RHFValidationProps,
} from '../util';

export function SearchSelectFieldRHF<OptionType>(
  props: RHFControllerProps &
    RHFValidationProps &
    (OptionType extends SimpleStringSelectOption
      ? SimpleSearchSelectFieldProps<OptionType>
      : OptionType extends SimpleNumberSelectOption
      ? SimpleSearchSelectFieldProps<OptionType>
      : SearchSelectFieldProps<OptionType>),
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    rhfOptions,
    ...searchSelectProps
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

  const handleSelect = useCallback(
    (option: OptionType | undefined) => {
      setValue(name, option || null, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, name, isSubmitted, trigger, deps],
  );
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <SearchSelect<any>
      ref={field.ref}
      name={name}
      onBlur={field.onBlur}
      error={serializeError(error)}
      {...searchSelectProps}
      // Put these at the end because the spread might add them from the search select hook's result.
      selected={field.value}
      onSelect={handleSelect}
    />
  );
}
