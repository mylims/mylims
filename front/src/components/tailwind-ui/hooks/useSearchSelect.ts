import { useMemo, useState } from 'react';

import { SimpleSelectOption } from '../forms/basic/Select';
import {
  OptionsFilter,
  defaultOptionsFilter,
} from '../utils/search-select-utils';

export type { OptionsFilter };

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
  filterOptions?: OptionsFilter<OptionType>;
  initialSelected?: OptionType;
}

export interface SearchSelectHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {
  filterOptions: OptionsFilter<OptionType>;
}

export function useSearchSelect<OptionType>(
  config: OptionType extends SimpleSelectOption
    ? SimpleSearchSelectHookConfig<OptionType>
    : SearchSelectHookConfig<OptionType>,
): SearchSelectHookResult<OptionType> {
  const {
    options,
    filterOptions = defaultOptionsFilter,
    initialSelected,
  } = config;
  const [searchValue, setSearchValue] = useState('');
  const newOptions = useMemo(
    () => filterOptions(searchValue, options),
    [options, filterOptions, searchValue],
  );
  const [selected, onSelect] = useState<OptionType | undefined>(
    initialSelected,
  );

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: newOptions,
    selected,
    onSelect,
  };
}
