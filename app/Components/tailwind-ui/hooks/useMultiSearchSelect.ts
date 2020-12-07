import { useMemo, useState } from 'react';

import {
  defaultOptionsFilter,
  SimpleOption,
} from '../utils/search-select-utils';

import {
  SearchSelectHookConfig,
  SearchSelectHookResult,
  SimpleSearchSelectHookConfig,
} from './useSearchSelect';

export interface MultiSearchSelectHookResult<T>
  extends Omit<SearchSelectHookResult<T>, 'selected' | 'onSelect'> {
  selected: T[];
  onSelect: (newOptions: T[]) => void;
}

export type SimpleMultiSearchSelectHookConfig<
  T extends SimpleOption
> = SimpleSearchSelectHookConfig<T>;
export type MultiSearchSelectHookConfig<T> = SearchSelectHookConfig<T>;

export function useMultiSearchSelect<T extends SimpleOption>(
  config: SimpleMultiSearchSelectHookConfig<T>,
): MultiSearchSelectHookResult<T>;
export function useMultiSearchSelect<T>(
  config: MultiSearchSelectHookConfig<T>,
): MultiSearchSelectHookResult<T>;
export function useMultiSearchSelect<T>(
  config: T extends SimpleOption
    ? SimpleMultiSearchSelectHookConfig<T>
    : MultiSearchSelectHookConfig<T>,
): MultiSearchSelectHookResult<T> {
  const { options, filterOptions = defaultOptionsFilter } = config;
  const [searchValue, setSearchValue] = useState('');
  const newOptions = useMemo(() => filterOptions(searchValue, options), [
    options,
    filterOptions,
    searchValue,
  ]);
  const [selected, setSelected] = useState<T[]>([]);

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: newOptions,
    selected,
    onSelect: setSelected,
  };
}
