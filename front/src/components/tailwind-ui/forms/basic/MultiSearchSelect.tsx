import React, { MouseEvent, Ref, useCallback, useMemo } from 'react';

import { Badge, BadgeVariant } from '../../elements/badge/Badge';
import { Color } from '../../types';
import { forwardRefWithGeneric } from '../../util';
import {
  defaultCanCreate,
  defaultGetValue,
  defaultRenderOption,
  defaultGetBadgeColor,
  defaultIsOptionRemovable,
  useSearchSelectInternals,
  InternalMultiSearchSelect,
  defaultRenderCreate,
} from '../../utils/search-select-utils';

import { SearchSelectProps, SimpleSearchSelectProps } from './SearchSelect';
import { SimpleStringSelectOption, SimpleNumberSelectOption } from './Select';

export interface SimpleMultiSearchSelectProps<OptionType>
  extends Omit<SimpleSearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
  isOptionRemovable?: (option: OptionType) => boolean;
}

export interface MultiSearchSelectProps<OptionType>
  extends Omit<SearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  name: string;
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
  isOptionRemovable?: (option: OptionType) => boolean;
}

export const MultiSearchSelect = forwardRefWithGeneric(
  MultiSearchSelectForwardRef,
);

function MultiSearchSelectForwardRef<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleMultiSearchSelectProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleMultiSearchSelectProps<OptionType>
    : MultiSearchSelectProps<OptionType>,
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  const {
    onSearchChange,
    options,
    onSelect,
    getBadgeColor = defaultGetBadgeColor,
    isOptionRemovable = defaultIsOptionRemovable,
    selected,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    onCreate,
    canCreate = defaultCanCreate,
    renderCreate = defaultRenderCreate,
    clearable = true,
    disabled = false,
    ...otherProps
  } = props;

  const optionsWithoutSelected = useMemo(() => {
    const selectedValues = new Set(selected.map(getValue));
    return options.filter((option) => !selectedValues.has(getValue(option)));
  }, [options, selected, getValue]);

  const renderedSelected = useMemo(() => {
    return selected.map((option) => {
      const value = getValue(option);
      const rendered = renderOption(option);

      function handleDismiss(event: MouseEvent) {
        event.preventDefault();
        onSelect(selected.filter((option) => getValue(option) !== value));
      }

      return (
        <Badge
          key={value}
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={rendered}
          color={getBadgeColor(option)}
          rounded
          onDismiss={
            disabled || !isOptionRemovable(option) ? undefined : handleDismiss
          }
        />
      );
    });
  }, [
    selected,
    getValue,
    renderOption,
    onSelect,
    getBadgeColor,
    disabled,
    isOptionRemovable,
  ]);

  const handleSelect = useCallback(
    (value: OptionType | undefined) => {
      if (value === undefined) {
        onSelect([]);
      } else {
        onSelect([...selected, value]);
      }
    },
    [selected, onSelect],
  );

  const handleBackspace = useCallback(() => {
    if (
      selected.length > 0 &&
      isOptionRemovable(selected[selected.length - 1])
    ) {
      onSelect(selected.slice(0, selected.length - 1));
    }
  }, [isOptionRemovable, onSelect, selected]);

  const internalProps = useSearchSelectInternals({
    searchValue: props.searchValue,
    onSearchChange,
    options: optionsWithoutSelected,
    onSelect: handleSelect,
    getValue,
    renderOption,
    onCreate,
    canCreate,
    renderCreate,
    onBackspace: handleBackspace,
  });

  return (
    <InternalMultiSearchSelect
      {...internalProps}
      {...otherProps}
      inputRef={ref}
      clearable={clearable}
      disabled={disabled}
      hasValue={selected.length !== 0}
      selectedBadges={renderedSelected}
    />
  );
}
