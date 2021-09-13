import { useField } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../forms/basic/Select';
import { defaultOptionsFilter } from '../utils/search-select-utils';

import {
  SearchSelectHookConfig,
  SearchSelectHookResult,
  SimpleSearchSelectHookConfig,
} from './useSearchSelect';

export interface MultiSearchSelectHookResult<OptionType>
  extends Omit<SearchSelectHookResult<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  onSelect: (newOptions: OptionType[]) => void;
}

export interface MultiSearchSelectFieldHookResult<OptionType>
  extends MultiSearchSelectHookResult<OptionType> {
  name: string;
}

export interface SimpleMultiSearchSelectHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {}
export interface MultiSearchSelectHookConfig<OptionType>
  extends SearchSelectHookConfig<OptionType> {}

export interface MultiSearchSelectFieldHookConfig<OptionType>
  extends MultiSearchSelectHookConfig<OptionType> {
  name: string;
}

export interface SimpleMultiSearchSelectFieldHookConfig<OptionType>
  extends SimpleMultiSearchSelectHookConfig<OptionType> {
  name: string;
}

export function useMultiSearchSelectField<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleMultiSearchSelectFieldHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleMultiSearchSelectFieldHookConfig<OptionType>
    : MultiSearchSelectFieldHookConfig<OptionType>,
): MultiSearchSelectFieldHookResult<OptionType> {
  const searchSelect = useMultiSearchSelect<OptionType>(config);
  const [field, , helper] = useField<OptionType[]>(config.name);

  return {
    ...searchSelect,
    onSelect: helper.setValue,
    selected: field.value,
    name: config.name,
  };
}

export function useMultiSearchSelectFieldRHF<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleMultiSearchSelectFieldHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleMultiSearchSelectFieldHookConfig<OptionType>
    : MultiSearchSelectFieldHookConfig<OptionType>,
): MultiSearchSelectFieldHookResult<OptionType> {
  const searchSelect = useMultiSearchSelect<OptionType>(config);
  const { setValue } = useFormContext();
  const fieldValue = useWatch({ name: config.name });
  const handleSelect = useCallback(
    (value: OptionType[]) => {
      setValue(config.name, value);
    },
    [setValue, config.name],
  );

  return {
    ...searchSelect,
    onSelect: handleSelect,
    selected: fieldValue,
    name: config.name,
  };
}

export function useMultiSearchSelect<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleMultiSearchSelectHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleMultiSearchSelectHookConfig<OptionType>
    : MultiSearchSelectHookConfig<OptionType>,
): MultiSearchSelectHookResult<OptionType> {
  const { options, filterOptions = defaultOptionsFilter } = config;
  const [searchValue, setSearchValue] = useState('');
  const newOptions = useMemo(
    () => filterOptions(searchValue, options),
    [options, filterOptions, searchValue],
  );
  const [selected, setSelected] = useState<OptionType[]>([]);

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: newOptions,
    selected,
    onSelect: setSelected,
  };
}
