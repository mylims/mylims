import { useField } from 'formik';
import { useMemo, useState } from 'react';

import { SimpleSelectOption } from '../forms/basic/Select';
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

export interface SimpleMultiSearchSelectHookConfig<
  OptionType extends SimpleSelectOption,
> extends SimpleSearchSelectHookConfig<OptionType> {}
export interface MultiSearchSelectHookConfig<OptionType>
  extends SearchSelectHookConfig<OptionType> {}

export interface MultiSearchSelectFieldHookConfig<OptionType>
  extends MultiSearchSelectHookConfig<OptionType> {
  name: string;
}

export interface SimpleMultiSearchSelectFieldHookConfig<
  OptionType extends SimpleSelectOption,
> extends SimpleMultiSearchSelectHookConfig<OptionType> {
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

export function useMultiSearchSelect<OptionType>(
  config: OptionType extends SimpleSelectOption
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
