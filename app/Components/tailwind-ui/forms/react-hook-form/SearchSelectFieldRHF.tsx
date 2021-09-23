import React, { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { SearchSelect } from '../basic/SearchSelect';
import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../basic/Select';
import {
  SearchSelectFieldProps,
  SimpleSearchSelectFieldProps,
} from '../formik/SearchSelectField';
import { defaultErrorSerializer } from '../util';

export function SearchSelectFieldRHF<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectFieldProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSearchSelectFieldProps<OptionType>
    : SearchSelectFieldProps<OptionType>,
): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    deps,
    ...searchSelectProps
  } = props;
  const { setValue, trigger } = useFormContext();
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
