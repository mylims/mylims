import React, { ReactNode, useMemo } from 'react';

import {
  defaultCanCreate,
  defaultGetValue,
  defaultRenderOption,
  GetValue,
  InternalSearchSelect,
  RenderOption,
  SimpleOption,
  useSearchSelectInternals,
} from '../../utils/search-select-utils';

interface BaseSearchSelectProps<T> {
  // Custom props for search input
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  help?: string;
  searchValue: string;
  onSearchChange: (newValue: string) => void;

  // Props passed directly to Input
  label: string;
  placeholder?: string;
  required?: boolean;
  onBlur?: (e: React.FocusEvent) => void;
  name?: string;

  // Custom props for results list
  options: T[];
  onSelect: (option: T | undefined) => void;
  selected?: T;
  noResultsHint?: ReactNode;
  onCreate?: (value: string) => void;
  canCreate?: (value: string) => boolean;

  highlightColor?: string;
}

export interface SimpleSearchSelectProps<T extends SimpleOption>
  extends BaseSearchSelectProps<T> {
  getValue?: GetValue<T>;
  renderOption?: RenderOption<T>;
}

export interface SearchSelectProps<T> extends BaseSearchSelectProps<T> {
  getValue: GetValue<T>;
  renderOption: RenderOption<T>;
}

export function SearchSelect<T extends SimpleOption>(
  props: SimpleSearchSelectProps<T>,
): JSX.Element;
export function SearchSelect<T>(props: SearchSelectProps<T>): JSX.Element;
export function SearchSelect<T>(
  props: T extends SimpleOption
    ? SimpleSearchSelectProps<T>
    : SearchSelectProps<T>,
): JSX.Element {
  const {
    onSearchChange,
    options,
    onSelect,
    selected,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    onCreate,
    canCreate = defaultCanCreate,
    ...otherProps
  } = props;

  const formattedSelected = useMemo(() => {
    if (selected) {
      return {
        value: getValue(selected),
        label: renderOption(selected),
      };
    }
  }, [selected, getValue, renderOption]);

  const internalProps = useSearchSelectInternals({
    searchValue: props.searchValue,
    onSearchChange,
    options,
    onSelect,
    getValue,
    renderOption,
    onCreate,
    canCreate,
    formattedSelected,
  });

  return (
    <InternalSearchSelect
      {...internalProps}
      {...otherProps}
      formattedSelected={formattedSelected}
      hasValue={formattedSelected !== undefined}
    />
  );
}
