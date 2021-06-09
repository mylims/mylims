import { useField } from 'formik';
import { useMemo, useState } from 'react';

import { SimpleSelectOption } from '../forms/basic/Select';
import {
  FilterOptions,
  defaultOptionsFilter,
} from '../utils/search-select-utils';

export interface SearchSelectHookResult<OptionType> {
  searchValue: string;
  onSearchChange: (newValue: string) => void;
  options: OptionType[];
  selected: OptionType | undefined;
  onSelect: (option: OptionType | undefined) => void;
}

export interface SearchSelectFieldHookResult<OptionType>
  extends SearchSelectHookResult<OptionType> {
  name: string;
}

export interface SimpleSearchSelectHookConfig<OptionType> {
  options: OptionType[];
  filterOptions?: FilterOptions<OptionType>;
}

export interface SimpleSearchSelectFieldHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {
  name: string;
}
export interface SearchSelectHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {
  filterOptions: FilterOptions<OptionType>;
}

export interface SearchSelectFieldHookConfig<OptionType>
  extends SearchSelectHookConfig<OptionType> {
  name: string;
}

export function useSearchSelectField<OptionType>(
  config: OptionType extends SimpleSelectOption
    ? SimpleSearchSelectFieldHookConfig<OptionType>
    : SearchSelectFieldHookConfig<OptionType>,
): SearchSelectFieldHookResult<OptionType> {
  const searchSelect = useSearchSelect<OptionType>(config);
  const [field, , helper] = useField<OptionType | undefined>(config.name);

  return {
    ...searchSelect,
    onSelect: helper.setValue,
    selected: field.value,
    name: config.name,
  };
}

export function useSearchSelect<OptionType>(
  config: OptionType extends SimpleSelectOption
    ? SimpleSearchSelectHookConfig<OptionType>
    : SearchSelectHookConfig<OptionType>,
): SearchSelectHookResult<OptionType> {
  const { options, filterOptions = defaultOptionsFilter } = config;
  const [searchValue, setSearchValue] = useState('');
  const newOptions = useMemo(
    () => filterOptions(searchValue, options),
    [options, filterOptions, searchValue],
  );
  const [selected, onSelect] = useState<OptionType>();

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: newOptions,
    selected,
    onSelect,
  };
}
