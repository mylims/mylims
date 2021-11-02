import { useField } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
} from '../forms/basic/Select';
import {
  OptionsFilter,
  defaultOptionsFilter,
} from '../utils/search-select-utils';

import { useCheckedFormRHFContext } from './useCheckedFormRHF';

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
}

export interface SimpleSearchSelectFieldHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {
  name: string;
}
export interface SearchSelectHookConfig<OptionType>
  extends SimpleSearchSelectHookConfig<OptionType> {
  filterOptions: OptionsFilter<OptionType>;
}

export interface SearchSelectFieldHookConfig<OptionType>
  extends SearchSelectHookConfig<OptionType> {
  name: string;
}

export function useSearchSelectField<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectFieldHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
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

export function useSearchSelectFieldRHF<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectFieldHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSearchSelectFieldHookConfig<OptionType>
    : SearchSelectFieldHookConfig<OptionType>,
): SearchSelectFieldHookResult<OptionType> {
  const searchSelect = useSearchSelect<OptionType>(config);
  const { setValue } = useCheckedFormRHFContext();
  const fieldValue = useWatch({
    name: config.name,
  });
  const onSelectHandle = useCallback(
    (value: OptionType | undefined) => {
      setValue(config.name, value);
    },
    [setValue, config.name],
  );

  return {
    ...searchSelect,
    onSelect: onSelectHandle,
    selected: fieldValue,
    name: config.name,
  };
}

export function useSearchSelect<OptionType>(
  config: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectHookConfig<OptionType>
    : OptionType extends SimpleNumberSelectOption
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
