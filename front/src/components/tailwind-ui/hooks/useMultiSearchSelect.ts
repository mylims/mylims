import { useField } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { SimpleSelectOption } from '../forms/basic/Select';
import { defaultOptionsFilter } from '../utils/search-select-utils';

import { useCheckedFormRHFContext } from './useCheckedFormRHF';
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
  extends Omit<SimpleSearchSelectHookConfig<OptionType>, 'initialSelected'> {
  initialSelected?: OptionType[];
}
export interface MultiSearchSelectHookConfig<OptionType>
  extends Omit<SearchSelectHookConfig<OptionType>, 'initialSelected'> {
  initialSelected?: OptionType[];
}

export interface MultiSearchSelectFieldHookConfig<OptionType>
  extends Omit<MultiSearchSelectHookConfig<OptionType>, 'initialSelected'> {
  name: string;
}

export interface SimpleMultiSearchSelectFieldHookConfig<OptionType>
  extends Omit<
    SimpleMultiSearchSelectHookConfig<OptionType>,
    'initialSelected'
  > {
  name: string;
}

export function useMultiSearchSelectField<OptionType>(
  config: OptionType extends SimpleSelectOption
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
  config: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectFieldHookConfig<OptionType>
    : MultiSearchSelectFieldHookConfig<OptionType>,
): MultiSearchSelectFieldHookResult<OptionType> {
  const searchSelect = useMultiSearchSelect<OptionType>(config);
  const { setValue } = useCheckedFormRHFContext();
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
  config: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectHookConfig<OptionType>
    : MultiSearchSelectHookConfig<OptionType>,
): MultiSearchSelectHookResult<OptionType> {
  const {
    options,
    filterOptions = defaultOptionsFilter,
    initialSelected = [],
  } = config;
  const [searchValue, setSearchValue] = useState('');
  const filteredOptions = useMemo(
    () => filterOptions(searchValue, options),
    [options, filterOptions, searchValue],
  );
  const [selected, setSelected] = useState<OptionType[]>(initialSelected);

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: filteredOptions,
    selected,
    onSelect: setSelected,
  };
}
