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
import { useSameWidthPopper } from '../hooks/popper';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useOnOff } from '../hooks/useOnOff';
import { Color } from '../types';

export interface SimpleOption {
  value: string | number;
  label: string;
}

export type GetValue<T> = (option: T) => string | number;
export type RenderOption<T> = (option: T) => ReactNode;

export type FilterOptions<T> = (query: string, options: T[]) => T[];

export function defaultOptionsFilter<T extends SimpleOption>(
  query: string,
  options: T[],
): T[] {
  const lowerQuery = query.toLowerCase();
  return options.filter((option) =>
    String(option.label).toLowerCase().includes(lowerQuery),
  );
}

export function customOptionsFilter<T>(getText: (option: T) => string) {
  return (query: string, options: Array<T>) => {
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

export function defaultRenderOption(option: SimpleOption) {
  return option.label;
}

export function defaultGetValue(option: SimpleOption) {
  return option.value;
}

export function defaultCanCreate() {
  return true;
}

export function defaultGetBadgeColor() {
  return Color.neutral;
}

export function preventDefault(event: UIEvent) {
  event.preventDefault();
}

export type InternalOption<T> =
  | {
      type: 'option';
      value: string | number;
      label: ReactNode;
      originalValue: T;
    }
  | {
      type: 'create';
      value: '___internal_create___';
      label: string;
      originalValue: string;
    };

export function buildInternalOptions<T>(
  options: T[],
  getValue: GetValue<T>,
  renderOption: RenderOption<T>,
  createValue?: string,
): InternalOption<T>[] {
  const internalOptions: InternalOption<T>[] = options.map((option) => {
    return {
      type: 'option',
      value: getValue(option),
      label: renderOption(option),
      originalValue: option,
    };
  });
  if (createValue) {
    internalOptions.push({
      type: 'create',
      value: '___internal_create___',
      label: `Create "${createValue}"`,
      originalValue: createValue,
    });
  }
  return internalOptions;
}

export function FormattedOption<T>(props: {
  index: number;
  option: InternalOption<T>;
  focused: number;
  setFocused: (index: number) => void;
  select: (option: InternalOption<T>) => void;
  highlightColor: string;
}) {
  const { index, option, focused, setFocused, select } = props;
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
        isFocused ? props.highlightColor : 'text-neutral-900',
        'py-2 px-4',
      )}
      onMouseMove={() => setFocused(index)}
      onClick={() => select(option)}
    >
      {option.label}
    </div>
  );
}

interface UseSearchSelectInternalsConfig<T> {
  searchValue: string;
  onSearchChange: (newValue: string) => void;
  options: T[];
  onSelect: (option: T | undefined) => void;
  getValue: GetValue<T>;
  renderOption: RenderOption<T>;
  onCreate?: (value: string) => void;
  canCreate: (value: string) => boolean;
  formattedSelected?: { value: string | number; label: ReactNode };
}

export function useSearchSelectInternals<T>(
  config: UseSearchSelectInternalsConfig<T>,
): UseSearchSelectInternalsReturn<T> {
  const {
    searchValue,
    onSearchChange,
    options,
    onSelect,
    getValue,
    renderOption,
    onCreate,
    canCreate,
    formattedSelected,
  } = config;

  const [isListOpen, openList, closeList] = useOnOff(false);
  const [focused, setFocused] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(mainRef, closeList);

  const createValue =
    onCreate && searchValue && canCreate(searchValue) ? searchValue : undefined;

  const formattedOptions = useMemo(
    () => buildInternalOptions(options, getValue, renderOption, createValue),
    [options, getValue, renderOption, createValue],
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

  const {
    setReferenceElement,
    setPopperElement,
    popperProps,
  } = useSameWidthPopper({ placement: 'bottom', distance: 6 });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isListOpen) {
      openList();
    }
    onSearchChange(event.target.value);
  }

  function select(option: InternalOption<T>): void {
    if (option.type === 'option') {
      onSelect(option.originalValue);
    } else {
      onCreate?.(option.originalValue);
    }
    closeList();
    onSearchChange('');
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
          select(formattedOptions[focused]);
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
    select,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,
  };
}

interface UseSearchSelectInternalsReturn<T>
  extends ReturnType<typeof useSameWidthPopper> {
  mainRef: Ref<HTMLDivElement>;
  closeList: () => void;
  openList: () => void;
  isListOpen: boolean;
  formattedOptions: InternalOption<T>[];
  focused: number;
  setFocused: (newFocus: number) => void;
  select: (option: InternalOption<T>) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleChevronDownClick: (event: MouseEvent) => void;
  handleXClick: (event: MouseEvent) => void;
}

interface InternalSearchSelectProps<T>
  extends UseSearchSelectInternalsReturn<T> {
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  noResultsHint?: ReactNode;
  error?: string;
  help?: string;
  label: string;
  placeholder?: string;
  searchValue: string;
  formattedSelected?: { value: string | number; label: ReactNode };
  hasValue: boolean;
  leadingInlineAddon?: ReactNode;
  highlightColor?: string;
  required?: boolean;
  onBlur?: (e: React.FocusEvent) => void;
  name?: string;
}

export function InternalSearchSelect<T>(
  props: InternalSearchSelectProps<T>,
): JSX.Element {
  const {
    mainRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    select,
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
    placeholder,
    searchValue,
    formattedSelected,
    leadingInlineAddon,
    hasValue,
    name,
    onBlur,
    highlightColor = 'text-white bg-primary-600',
  } = props;

  return (
    <div ref={mainRef}>
      <Input
        required={required}
        wrapperRef={setReferenceElement}
        type="text"
        name={name || label}
        label={label}
        value={searchValue}
        disabled={disabled}
        error={error}
        help={help}
        onBlur={(event) => {
          onBlur?.(event);
          closeList();
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={openList}
        placeholder={placeholder}
        leadingInlineAddon={leadingInlineAddon}
        inlinePlaceholder={
          formattedSelected && !searchValue
            ? formattedSelected.label
            : undefined
        }
        trailingInlineAddon={
          <div className="inline-flex flex-row items-center cursor-default text-neutral-400">
            {loading && <Spinner className="w-5 h-5 mr-1 text-neutral-400" />}
            {clearable && hasValue && !disabled && (
              <XIcon
                className="w-4 h-4 hover:text-neutral-500"
                onClick={handleXClick}
              />
            )}
            {/* font-mono so the vertical bar is vertically aligned with the SVG */}
            <span className="mx-1 font-mono font-light">{` | `}</span>
            <ChevronDownIcon
              className={clsx({
                'w-5 h-5': true,
                'hover:text-neutral-500': !disabled,
              })}
              onMouseDown={preventDefault}
              onClick={disabled ? undefined : handleChevronDownClick}
            />
          </div>
        }
      />

      {isListOpen && (
        <div
          ref={setPopperElement}
          {...popperProps}
          className="z-20 w-full py-1 overflow-auto text-base bg-white rounded-md shadow-lg cursor-default max-h-60 sm:text-sm"
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
                select={select}
                highlightColor={highlightColor}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
