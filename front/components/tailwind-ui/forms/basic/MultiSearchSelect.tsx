import clsx from 'clsx';
import React, { MouseEvent, useCallback, useMemo } from 'react';

import { Badge, BadgeVariant } from '../../elements/badge/Badge';
import { Color } from '../../types';
import {
  defaultCanCreate,
  defaultGetValue,
  defaultRenderOption,
  defaultGetBadgeColor,
  InternalSearchSelect,
  useSearchSelectInternals,
} from '../../utils/search-select-utils';

import { SearchSelectProps, SimpleSearchSelectProps } from './SearchSelect';
import { SimpleSelectOption } from './Select';

export interface SimpleMultiSearchSelectProps<OptionType>
  extends Omit<SimpleSearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
}

export interface MultiSearchSelectProps<OptionType>
  extends Omit<SearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
}

export function MultiSearchSelect<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectProps<OptionType>
    : MultiSearchSelectProps<OptionType>,
): JSX.Element {
  const {
    onSearchChange,
    options,
    onSelect,
    getBadgeColor = defaultGetBadgeColor,
    selected,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    onCreate,
    canCreate = defaultCanCreate,
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
          className="mt-1 mr-1"
          onDismiss={disabled ? undefined : handleDismiss}
        />
      );
    });
  }, [selected, getValue, renderOption, onSelect, getBadgeColor, disabled]);

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

  const internalProps = useSearchSelectInternals({
    searchValue: props.searchValue,
    onSearchChange,
    options: optionsWithoutSelected,
    onSelect: handleSelect,
    getValue,
    renderOption,
    onCreate,
    canCreate,
  });

  return (
    <InternalSearchSelect
      {...internalProps}
      {...otherProps}
      clearable={clearable}
      disabled={disabled}
      hasValue={selected.length !== 0}
      leadingInlineAddon={
        <div
          className={clsx('inline-flex flex-row flex-wrap -mt-1', {
            'opacity-75': disabled,
          })}
        >
          {renderedSelected}
        </div>
      }
    />
  );
}
