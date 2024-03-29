import { ChevronDownIcon, XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
  UIEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Spinner } from '../elements/spinner/Spinner';
import { Input } from '../forms/basic/Input';
import {
  SearchSelectCanCreateCallback,
  SearchSelectOnCreateCallback,
  SearchSelectRenderCreateCallback,
} from '../forms/basic/SearchSelect';
import {
  GetValue,
  RenderOption,
  SimpleSelectOption,
} from '../forms/basic/Select';
import {
  Help,
  inputColor,
  inputError,
  Label,
  InputErrorIcon,
  InputCorner,
} from '../forms/basic/common';
import { useSameWidthPopper, UseSameWidthPopperReturn } from '../hooks/popper';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useOnOff } from '../hooks/useOnOff';
import { Color } from '../types';

export type OptionsFilter<OptionType> = (
  query: string,
  options: OptionType[],
) => OptionType[];

export type IsOptionRemovableCallback<OptionType> = (
  option: OptionType,
) => boolean;

export function defaultOptionsFilter<OptionType extends SimpleSelectOption>(
  query: string,
  options: OptionType[],
): OptionType[] {
  const lowerQuery = query.toLowerCase();
  return options.filter((option) =>
    String(defaultRenderOption(option)).toLowerCase().includes(lowerQuery),
  );
}

export function customOptionsFilter<OptionType>(
  getText: (option: OptionType) => string,
) {
  return (query: string, options: Array<OptionType>) => {
    const lowerQuery = query.toLowerCase();
    return options.filter((obj) =>
      getText(obj).toLowerCase().includes(lowerQuery),
    );
  };
}

function DefaultNoResultsHint() {
  return <div>No results.</div>;
}

export const defaultNoResultsHint = <DefaultNoResultsHint />;

export function defaultRenderOption(option: SimpleSelectOption): ReactNode {
  return typeof option === 'object' ? option.label : option;
}

export function defaultGetValue(option: SimpleSelectOption): string | number {
  return typeof option === 'object' ? option.value : option;
}

export function defaultCanCreate() {
  return true;
}

export function defaultRenderCreate(value: string) {
  return `Create "${value}"`;
}

export function defaultGetBadgeColor() {
  return Color.neutral;
}

export function defaultIsOptionRemovable() {
  return true;
}

export function preventDefault(event: UIEvent) {
  event.preventDefault();
}

export type InternalOption<OptionType> =
  | {
      type: 'option';
      value: string | number;
      label: ReactNode;
      originalValue: OptionType;
    }
  | {
      type: 'create';
      value: '___internal_create___';
      label: ReactNode;
      originalValue: string;
    };

export function buildInternalOptions<OptionType>(
  options: OptionType[],
  getValue: GetValue<OptionType>,
  renderOption: RenderOption<OptionType>,
  renderCreate: SearchSelectRenderCreateCallback,
  createValue?: string,
): InternalOption<OptionType>[] {
  const internalOptions: InternalOption<OptionType>[] = options.map(
    (option) => {
      return {
        type: 'option',
        value: getValue(option),
        label: renderOption(option),
        originalValue: option,
      };
    },
  );
  if (createValue) {
    internalOptions.push({
      type: 'create',
      value: '___internal_create___',
      label: renderCreate(createValue),
      originalValue: createValue,
    });
  }
  return internalOptions;
}

export interface FormattedOptionProps<OptionType> {
  index: number;
  option: InternalOption<OptionType>;
  focused: number;
  setFocused: (index: number) => void;
  onSelect: (option: InternalOption<OptionType>) => void;
  highlightClassName: string;
}

export function FormattedOption<OptionType>(
  props: FormattedOptionProps<OptionType>,
) {
  const { index, option, focused, setFocused, onSelect } = props;
  const isFocused = focused === index;
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);
  return (
    <div
      ref={ref}
      className={clsx(
        isFocused ? props.highlightClassName : 'text-neutral-900',
        'py-2 px-4',
      )}
      onMouseMove={() => setFocused(index)}
      onClick={() => onSelect(option)}
    >
      {option.label}
    </div>
  );
}

interface UseSearchSelectInternalsConfig<OptionType> {
  searchValue: string;
  onSearchChange: (newValue: string) => void;
  options: OptionType[];
  onSelect: (option: OptionType | undefined) => void;
  getValue: GetValue<OptionType>;
  renderOption: RenderOption<OptionType>;
  closeListOnSelect: boolean;
  clearSearchOnSelect: boolean;
  onCreate?: SearchSelectOnCreateCallback<OptionType>;
  canCreate: SearchSelectCanCreateCallback;
  renderCreate: SearchSelectRenderCreateCallback;
  onBackspace?: () => void;
  formattedSelected?: { value: string | number; label: ReactNode };
}

export function useSearchSelectInternals<OptionType>(
  config: UseSearchSelectInternalsConfig<OptionType>,
): UseSearchSelectInternalsReturn<OptionType> {
  const {
    searchValue,
    onSearchChange,
    options,
    onSelect,
    getValue,
    renderOption,
    closeListOnSelect,
    clearSearchOnSelect,
    onCreate,
    canCreate,
    formattedSelected,
    onBackspace,
    renderCreate,
  } = config;

  const [isListOpen, openList, closeList] = useOnOff(false);
  const [focused, setFocused] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(mainRef, closeList);

  const createValue =
    onCreate && searchValue && canCreate(searchValue) ? searchValue : undefined;

  const formattedOptions = useMemo(
    () =>
      buildInternalOptions(
        options,
        getValue,
        renderOption,
        renderCreate,
        createValue,
      ),
    [options, getValue, renderOption, renderCreate, createValue],
  );

  // Always reset focus to the first element if the options list has changed.
  useEffect(() => {
    if (formattedSelected) {
      for (let i = 0; i < formattedOptions.length; i++) {
        if (formattedSelected.value === formattedOptions[i].value) {
          setFocused(i);
          return;
        }
      }
    }
    setFocused(0);
  }, [formattedOptions, formattedSelected]);

  const { setReferenceElement, setPopperElement, popperProps } =
    useSameWidthPopper<HTMLElement>({ placement: 'bottom', distance: 6 });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isListOpen) {
      openList();
    }
    onSearchChange(event.target.value);
  }

  function selectOption(option: InternalOption<OptionType>): void {
    if (option.type === 'option') {
      onSelect(option.originalValue);
    } else {
      onCreate?.(option.originalValue, onSelect);
    }
    if (closeListOnSelect) {
      closeList();
    }
    if (clearSearchOnSelect) {
      onSearchChange('');
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowUp':
        if (!isListOpen) {
          openList();
        } else {
          const previous = focused - 1;
          setFocused(previous >= 0 ? previous : formattedOptions.length - 1);
        }
        // Prevent moving the input cursor.
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (!isListOpen) {
          openList();
        } else {
          setFocused((focused + 1) % formattedOptions.length);
        }
        // Prevent moving the input cursor.
        event.preventDefault();
        break;
      case 'Escape':
        onSearchChange('');
        if (isListOpen) {
          closeList();
        }
        break;
      case 'Enter':
        if (isListOpen && formattedOptions[focused]) {
          selectOption(formattedOptions[focused]);
        }
        // Prevent submitting the form.
        event.preventDefault();
        break;
      case ' ':
        if (searchValue === '') {
          if (isListOpen) {
            closeList();
          } else {
            openList();
          }
          event.preventDefault();
        }
        break;
      case 'Backspace':
        if (searchValue === '') {
          onBackspace?.();
        }
        break;
      default:
      // Ignore
    }
  }

  function handleChevronDownClick(event: MouseEvent) {
    if (isListOpen) {
      event.preventDefault();
      closeList();
    } else {
      openList();
    }
  }

  function handleXClick(event: MouseEvent) {
    event.preventDefault();
    onSelect(undefined);
  }

  return {
    mainRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect: selectOption,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,
  };
}

interface UseSearchSelectInternalsReturn<OptionType>
  extends UseSameWidthPopperReturn<HTMLElement> {
  mainRef: Ref<HTMLDivElement>;
  closeList: () => void;
  openList: () => void;
  isListOpen: boolean;
  formattedOptions: InternalOption<OptionType>[];
  focused: number;
  setFocused: (newFocus: number) => void;
  onSelect: (option: InternalOption<OptionType>) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleChevronDownClick: (event: MouseEvent) => void;
  handleXClick: (event: MouseEvent) => void;
}

interface InternalSearchSelectProps<OptionType>
  extends UseSearchSelectInternalsReturn<OptionType> {
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  noResultsHint?: ReactNode;
  error?: string;
  help?: string;
  label: string;
  hiddenLabel?: boolean;
  corner?: ReactNode;
  placeholder?: string;
  searchValue: string;
  formattedSelected?: { value: string | number; label: ReactNode };
  hasClearableValue: boolean;
  highlightClassName?: string;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: (e: React.FocusEvent) => void;
  name?: string;
  id?: string;
  size?: number;
}

export function InternalSearchSelect<OptionType>(
  props: InternalSearchSelectProps<OptionType>,
): JSX.Element {
  const {
    mainRef,
    inputRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,

    clearable = false,
    disabled = false,
    required = false,
    loading = false,
    noResultsHint = defaultNoResultsHint,
    error,
    help,
    label,
    hiddenLabel,
    corner,
    placeholder,
    searchValue,
    formattedSelected,
    hasClearableValue,
    name,
    onBlur,
    highlightClassName = 'text-white bg-primary-600',
    size,
  } = props;

  return (
    <div ref={mainRef}>
      <Input
        ref={inputRef}
        required={required}
        wrapperRef={setReferenceElement}
        type="text"
        name={name || label}
        label={label}
        hiddenLabel={hiddenLabel}
        corner={corner}
        value={searchValue}
        disabled={disabled}
        size={size}
        error={error}
        help={help}
        autoComplete="off"
        onBlur={(event) => {
          onBlur?.(event);
          closeList();
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={openList}
        placeholder={placeholder}
        inlinePlaceholder={
          formattedSelected && !searchValue
            ? formattedSelected.label
            : undefined
        }
        trailingInlineAddon={
          <TrailingTools
            {...{
              loading,
              clearable,
              hasClearableValue,
              disabled,
              handleXClick,
              handleChevronDownClick,
            }}
          />
        }
      />

      {isListOpen && (
        <OptionsList
          {...{
            setPopperElement,
            popperProps,
            formattedOptions,
            noResultsHint,
            focused,
            setFocused,
            onSelect,
            highlightClassName,
          }}
        />
      )}
    </div>
  );
}

interface InternalMultiSearchSelectProps<OptionType>
  extends InternalSearchSelectProps<OptionType> {
  selectedBadges?: ReactNode[];
}
export function InternalMultiSearchSelect<OptionType>(
  props: InternalMultiSearchSelectProps<OptionType>,
): JSX.Element {
  const {
    mainRef,
    inputRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,

    clearable = false,
    disabled = false,
    required = false,
    loading = false,
    autoFocus = false,
    noResultsHint,
    error,
    help,
    label,
    hiddenLabel,
    corner,
    placeholder,
    searchValue,
    selectedBadges,
    hasClearableValue,
    name,
    id = name,
    onBlur,
    highlightClassName,
  } = props;

  return (
    <div ref={mainRef} className="flex flex-col">
      <div className="flex items-baseline justify-between gap-2">
        <Label
          id={id}
          text={label}
          hidden={hiddenLabel}
          required={required}
          disabled={disabled}
        />
        <InputCorner>{corner}</InputCorner>
      </div>
      <label
        ref={setReferenceElement}
        htmlFor={id}
        className={clsx(
          'border bg-white py-2 px-3 focus-within:ring-1',
          'relative flex flex-1 flex-row text-base shadow-sm sm:text-sm',
          'rounded-md',
          {
            'mt-1': !hiddenLabel || corner,
            [inputColor]: !error,
            [inputError]: error,
            'bg-neutral-50 text-neutral-500': disabled,
          },
        )}
      >
        <div className="flex flex-1 flex-row flex-wrap gap-1.5">
          {selectedBadges}
          <input
            id={id}
            ref={inputRef}
            type="text"
            name={name || label}
            value={searchValue}
            size={Math.max(5, placeholder?.length || 0, searchValue.length)}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete="off"
            onBlur={(event) => {
              onBlur?.(event);
              closeList();
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={openList}
            placeholder={placeholder}
            className={clsx(
              {
                'flex-1 border-none p-0 focus:outline-none focus:ring-0 sm:text-sm':
                  true,
                'bg-neutral-50 text-neutral-500': disabled,
              },
              error ? 'placeholder-danger-300' : 'placeholder-neutral-400',
            )}
          />
        </div>
        <TrailingTools
          {...{
            loading,
            clearable,
            hasClearableValue,
            hasError: Boolean(error),
            disabled,
            handleXClick,
            handleChevronDownClick,
          }}
        />
      </label>
      <Help error={error} help={help} />
      {isListOpen && (
        <OptionsList
          {...{
            setPopperElement,
            popperProps,
            formattedOptions,
            noResultsHint,
            focused,
            setFocused,
            onSelect,
            highlightClassName,
          }}
        />
      )}
    </div>
  );
}

type OptionsListProps<OptionType> = Pick<
  UseSearchSelectInternalsReturn<OptionType>,
  | 'setPopperElement'
  | 'popperProps'
  | 'formattedOptions'
  | 'focused'
  | 'setFocused'
  | 'onSelect'
> &
  Pick<
    InternalSearchSelectProps<OptionType>,
    'noResultsHint' | 'highlightClassName'
  >;

function OptionsList<OptionType>(props: OptionsListProps<OptionType>) {
  const {
    setPopperElement,
    popperProps,
    formattedOptions,
    noResultsHint = defaultNoResultsHint,
    focused,
    setFocused,
    onSelect,
    highlightClassName = 'text-white bg-primary-600',
  } = props;
  return (
    <div
      ref={setPopperElement}
      {...popperProps}
      className="z-20 max-h-60 w-full cursor-default overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm"
      // Prevent click in the options list from blurring the input,
      // because that would close the list.
      onMouseDown={preventDefault}
    >
      {formattedOptions.length === 0 ? (
        <div className="p-2">{noResultsHint}</div>
      ) : (
        formattedOptions.map((option, index) => (
          <FormattedOption
            key={option.value}
            index={index}
            option={option}
            focused={focused}
            setFocused={setFocused}
            onSelect={onSelect}
            highlightClassName={highlightClassName}
          />
        ))
      )}
    </div>
  );
}

interface TrailingToolsProps {
  loading?: boolean;
  clearable?: boolean;
  hasClearableValue: boolean;
  hasError?: boolean;
  disabled?: boolean;
  handleXClick: (event: MouseEvent) => void;
  handleChevronDownClick: (event: MouseEvent) => void;
}

function TrailingTools(props: TrailingToolsProps) {
  const {
    loading,
    clearable,
    hasClearableValue,
    hasError,
    disabled,
    handleXClick,
    handleChevronDownClick,
  } = props;
  return (
    <div className="inline-flex cursor-default flex-row items-center text-neutral-400">
      {loading && <Spinner className="mr-1 h-5 w-5 text-neutral-400" />}
      {clearable && hasClearableValue && !disabled && (
        <XIcon
          className="h-4 w-4 hover:text-neutral-500"
          onClick={handleXClick}
        />
      )}
      {/* font-mono so the vertical bar is vertically aligned with the SVG */}
      <span className="mx-1 font-mono font-light">{` | `}</span>
      <ChevronDownIcon
        className={clsx({
          'h-5 w-5': true,
          'hover:text-neutral-500': !disabled,
        })}
        onMouseDown={preventDefault}
        onClick={disabled ? undefined : handleChevronDownClick}
      />
      {hasError && <InputErrorIcon />}
    </div>
  );
}
