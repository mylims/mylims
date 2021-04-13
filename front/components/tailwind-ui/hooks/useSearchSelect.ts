import { useField } from 'formik';
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

export type SearchSelectFieldHookResult<T> = SearchSelectHookResult<T> & {
  name: string;
};
interface BaseSearchSelectHookConfig<T> {
  options: T[];
}

export interface SimpleSearchSelectHookConfig<T extends SimpleOption>
  extends BaseSearchSelectHookConfig<T> {
  filterOptions?: FilterOptions<T>;
}

export type SimpleSearchSelectFieldHookConfig<
  T extends SimpleOption
> = SimpleSearchSelectHookConfig<T> & {
  name: string;
};
export interface SearchSelectHookConfig<T>
  extends BaseSearchSelectHookConfig<T> {
  filterOptions: FilterOptions<T>;
}

export type SearchSelectFieldHookConfig<T> = SearchSelectHookConfig<T> & {
  name: string;
};

export function useSearchSelectField<T extends SimpleOption>(
  config: SimpleSearchSelectFieldHookConfig<T>,
): SearchSelectFieldHookResult<T>;
export function useSearchSelectField<T>(
  config: SearchSelectFieldHookConfig<T>,
): SearchSelectFieldHookResult<T>;
export function useSearchSelectField<T>(
  config: T extends SimpleOption
    ? SimpleSearchSelectFieldHookConfig<T>
    : SearchSelectFieldHookConfig<T>,
): SearchSelectFieldHookResult<T> {
  // @ts-expect-error
  const searchSelect = useSearchSelect<T>(config);
  const [field, , helper] = useField<T | undefined>(config.name);

  return {
    ...searchSelect,
    onSelect: helper.setValue,
    selected: field.value,
    name: config.name,
  };
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
