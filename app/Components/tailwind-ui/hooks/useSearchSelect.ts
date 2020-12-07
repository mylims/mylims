import { useMemo, useState } from 'react';

import {
  SimpleOption,
  FilterOptions,
  defaultOptionsFilter,
} from '../utils/search-select-utils';

export interface SearchSelectHookResult<T> {
  searchValue: string;
  onSearchChange: (newValue: string) => void;
  options: T[];
  selected: T | undefined;
  onSelect: (option: T | undefined) => void;
}

interface BaseSearchSelectHookConfig<T> {
  options: T[];
}

export interface SimpleSearchSelectHookConfig<T extends SimpleOption>
  extends BaseSearchSelectHookConfig<T> {
  filterOptions?: FilterOptions<T>;
}
export interface SearchSelectHookConfig<T>
  extends BaseSearchSelectHookConfig<T> {
  filterOptions: FilterOptions<T>;
}

export function useSearchSelect<T extends SimpleOption>(
  config: SimpleSearchSelectHookConfig<T>,
): SearchSelectHookResult<T>;
export function useSearchSelect<T>(
  config: SearchSelectHookConfig<T>,
): SearchSelectHookResult<T>;
export function useSearchSelect<T>(
  config: T extends SimpleOption
    ? SimpleSearchSelectHookConfig<T>
    : SearchSelectHookConfig<T>,
): SearchSelectHookResult<T> {
  const { options, filterOptions = defaultOptionsFilter } = config;
  const [searchValue, setSearchValue] = useState('');
  const newOptions = useMemo(() => filterOptions(searchValue, options), [
    options,
    filterOptions,
    searchValue,
  ]);
  const [selected, onSelect] = useState<T>();

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: newOptions,
    selected,
    onSelect,
  };
}
