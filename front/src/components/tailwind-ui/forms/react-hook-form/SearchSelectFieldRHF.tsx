import React, { useCallback } from 'react';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import {
  SearchSelect,
  SearchSelectProps,
  SimpleSearchSelectProps,
} from '../basic/SearchSelect';
import { SimpleSelectOption } from '../basic/Select';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
} from '../util';

export type SearchSelectFieldProps<OptionType> = Omit<
  SearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error'
> &
  FieldProps;

export type SimpleSearchSelectFieldProps<OptionType> = Omit<
  SimpleSearchSelectProps<OptionType>,
  'selected' | 'onSelect' | 'error' | 'onBlur'
> &
  FieldProps;

export function SearchSelectFieldRHF<OptionType>(
  props: RHFValidationProps &
    (OptionType extends SimpleSelectOption
      ? SimpleSearchSelectFieldProps<OptionType>
      : SearchSelectFieldProps<OptionType>),
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    ...searchSelectProps
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
