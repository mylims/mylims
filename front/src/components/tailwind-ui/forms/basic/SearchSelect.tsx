import React, { Ref, useMemo } from 'react';

import { forwardRefWithGeneric } from '../../util';
import {
  defaultCanCreate,
  defaultGetValue,
  defaultRenderOption,
  InternalSearchSelect,
  useSearchSelectInternals,
} from '../../utils/search-select-utils';

import {
  SimpleStringSelectOption,
  SimpleNumberSelectOption,
  GetValue,
  RenderOption,
} from './Select';

export interface SimpleSearchSelectProps<OptionType> {
  /**
   * List of options to select from.
   */
  options: OptionType[];
  /**
   * Currently selected option.
   */
  selected?: OptionType;
  /**
   * Callback which will be called when an option is selected or when clearing is requested.
   */
  onSelect: (option: OptionType | undefined) => void;
  /**
   * Callback which will be called when the user selects the "create" option.
   * Passing this prop is what makes the option to appear.
   */
  onCreate?: (value: string) => void;
  /**
   * Callback which will be called before displaying the "create" option to the
   * user. If it is present and doesn't return `true`, the option will not be displayed.
   */
  canCreate?: (value: string) => boolean;

  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue?: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption?: RenderOption<OptionType>;

  /**
   * Value to control the input field.
   */
  searchValue: string;
  /**
   * Called when the value in the input is about to change.
   */
  onSearchChange: (newValue: string) => void;
  /**
   * Input field's label.
   */
  label: string;
  /**
   * Placeholder to display when no value is selected and no search text is entered.
   */
  placeholder?: string;
  /**
   * Adds a red * to the label.
   */
  required?: boolean;
  /**
   * Called when the input field is blurred.
   */
  onBlur?: (e: React.FocusEvent) => void;
  /**
   * Input field's name.
   */
  name?: string;
  /**
   * Allows to unselect the currently selected value.
   */
  clearable?: boolean;
  /**
   * Disable interactions with the field.
   */
  disabled?: boolean;
  /**
   * Displays a spinner in the field.
   */
  loading?: boolean;
  /**
   * Error message.
   */
  error?: string;
  /**
   * Explanation or precisions about what the field is for.
   */
  help?: string;
  /**
   * Class applied to the highlighted option.
   */
  highlightClassName?: string;
}

export interface SearchSelectProps<OptionType>
  extends SimpleSearchSelectProps<OptionType> {
  getValue: GetValue<OptionType>;
  renderOption: RenderOption<OptionType>;
}

export const SearchSelect = forwardRefWithGeneric(SearchSelectForwardRef);

function SearchSelectForwardRef<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSearchSelectProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSearchSelectProps<OptionType>
    : SearchSelectProps<OptionType>,
  ref: Ref<HTMLInputElement>,
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
      inputRef={ref}
      formattedSelected={formattedSelected}
      hasValue={formattedSelected !== undefined}
    />
  );
}
