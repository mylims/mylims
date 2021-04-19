import { useField } from 'formik';
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

export type MultiSearchSelectFieldHookResult<
  T
> = MultiSearchSelectHookResult<T> & {
  name: string;
};

export type SimpleMultiSearchSelectHookConfig<
  T extends SimpleOption
> = SimpleSearchSelectHookConfig<T>;
export type MultiSearchSelectHookConfig<T> = SearchSelectHookConfig<T>;

export type MultiSearchSelectFieldHookConfig<
  T
> = MultiSearchSelectHookConfig<T> & {
  name: string;
};

export type SimpleMultiSearchSelectFieldHookConfig<
  T extends SimpleOption
> = SimpleMultiSearchSelectHookConfig<T> & {
  name: string;
};

export function useMultiSearchSelectField<T extends SimpleOption>(
  config: SimpleMultiSearchSelectFieldHookConfig<T>,
): MultiSearchSelectFieldHookResult<T>;
export function useMultiSearchSelectField<T>(
  config: MultiSearchSelectFieldHookConfig<T>,
): MultiSearchSelectFieldHookResult<T>;
export function useMultiSearchSelectField<T>(
  config: T extends SimpleOption
    ? SimpleMultiSearchSelectFieldHookConfig<T>
    : MultiSearchSelectFieldHookConfig<T>,
): MultiSearchSelectFieldHookResult<T> {
  // @ts-expect-error
  const searchSelect = useMultiSearchSelect<T>(config);
  const [field, , helper] = useField<T[]>(config.name);

  return {
    ...searchSelect,
    onSelect: helper.setValue,
    selected: field.value,
    name: config.name,
  };
}

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
