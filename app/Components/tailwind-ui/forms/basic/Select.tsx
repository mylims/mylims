import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { useSameWidthPopper } from '../../hooks/popper';

import {
  labelDisabledColor,
  labelColor,
  inputError,
  inputColor,
  Help,
  InputCorner,
} from './common';

export interface SimpleStringSelectOption {
  value: string;
  label: ReactNode;
}

export interface SimpleNumberSelectOption {
  value: number;
  label: ReactNode;
}

export type GetValue<OptionType> = (option: OptionType) => string | number;
export type RenderOption<OptionType> = (option: OptionType) => ReactNode;

function simpleGetValue(
  option: SimpleStringSelectOption | SimpleNumberSelectOption,
) {
  return option.value;
}

function simpleRenderOption(
  option: SimpleStringSelectOption | SimpleNumberSelectOption,
) {
  return option.label;
}

export interface SelectProps<OptionType> extends SimpleSelectProps<OptionType> {
  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption: RenderOption<OptionType>;
}

export interface SimpleSelectProps<OptionType> {
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
  onSelect?: (selected: OptionType | undefined) => void;

  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue?: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption?: RenderOption<OptionType>;

  /**
   * Field label.
   */
  label?: string;
  /**
   * Do not display the label.
   */
  hiddenLabel?: boolean;
  /**
   * Explanation or precisions about what the field is for.
   */
  help?: string;
  /**
   * Error message.
   */
  error?: string;
  /**
   * Placeholder to display when no value is selected.
   */
  placeholder?: string;

  /**
   * Adds a red * to the label.
   */
  required?: boolean;
  /**
   * Allows to unselect the currently selected value.
   */
  clearable?: boolean;
  /**
   * Disable interactions with the field.
   */
  disabled?: boolean;

  /**
   * Class applied to the outermost div element.
   */
  className?: string;
  /**
   * Class applied to the highlighted option.
   */
  highlightClassName?: string;
  /**
   * Custom react node to display in the upper right corner of the input
   */
  corner?: ReactNode;
}

export function Select<OptionType>(
  props: OptionType extends SimpleStringSelectOption
    ? SimpleSelectProps<OptionType>
    : OptionType extends SimpleNumberSelectOption
    ? SimpleSelectProps<OptionType>
    : SelectProps<OptionType>,
): JSX.Element {
  const {
    options,
    selected,
    onSelect,
    className,
    label,
    hiddenLabel = false,
    error,
    help,
    placeholder,
    required = false,
    clearable = false,
    disabled = false,
    corner,
    getValue = simpleGetValue,
    renderOption = simpleRenderOption,
    highlightClassName = 'text-white bg-primary-600',
  } = props;

  const selectedValue = selected ? getValue(selected) : undefined;

  const { setReferenceElement, setPopperElement, popperProps } =
    useSameWidthPopper<HTMLSpanElement>({ placement: 'bottom', distance: 5 });

  if (
    selected &&
    !options.some((element) => getValue(element) === selectedValue)
  ) {
    throw new Error(
      'Select component contains a selected value that is not in options',
    );
  }

  function handleChange(value: string | number | undefined) {
    if (!onSelect) {
      return;
    }
    if (value === undefined) {
      return onSelect(undefined);
    }
    const option = options.find((option) => getValue(option) === value);
    if (!option) {
      throw new Error('unreachable');
    }
    onSelect(option);
  }

  return (
    <div className={className}>
      <Listbox
        as="div"
        className="space-y-1"
        value={selectedValue}
        disabled={disabled}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            {(label || corner) && (
              <div
                className={clsx(
                  'flex items-baseline justify-between gap-2',
                  // Cancel the margin from "space-y-1"
                  hiddenLabel && !corner && '-mb-1',
                )}
              >
                <Listbox.Label
                  className={clsx(
                    'block text-sm font-semibold',
                    disabled ? labelDisabledColor : labelColor,
                    hiddenLabel && 'sr-only',
                  )}
                >
                  {label}
                  {required && <span className="text-warning-600"> *</span>}
                </Listbox.Label>
                <InputCorner>{corner}</InputCorner>
              </div>
            )}
            <div className="relative">
              <span
                ref={setReferenceElement}
                className="inline-block w-full rounded-md shadow-sm"
              >
                <Listbox.Button
                  className={clsx(
                    'relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 sm:text-sm',
                    error ? inputError : inputColor,
                  )}
                >
                  <span className="block truncate">
                    {selected ? (
                      renderOption(selected)
                    ) : (
                      <span
                        className={
                          error ? 'text-danger-300' : 'text-neutral-400'
                        }
                      >
                        {placeholder}&nbsp;
                      </span>
                    )}
                  </span>

                  {!disabled && clearable && selected && (
                    <div
                      className="absolute inset-y-0 right-6 mr-2 flex cursor-pointer items-center"
                      onPointerUp={(event) => {
                        event.stopPropagation();
                        onSelect?.(undefined);
                      }}
                    >
                      <XIcon className="h-4 w-4 text-neutral-400 hover:text-neutral-500" />
                    </div>
                  )}

                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="h-5 w-5 text-neutral-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              {!disabled && (
                <Transition
                  show={open}
                  leave="transition-opacity ease-in duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute z-20 my-1 rounded-md shadow-lg"
                >
                  <div ref={setPopperElement} {...popperProps}>
                    <Listbox.Options
                      static
                      className="max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {options.map((option) => {
                        const value = getValue(option);
                        return (
                          <Listbox.Option key={value} value={value}>
                            {({ selected: isSelected, active }) => (
                              <div
                                className={clsx(
                                  active
                                    ? highlightClassName
                                    : 'text-neutral-900',
                                  'relative cursor-default select-none py-2 pl-8 pr-4',
                                )}
                              >
                                <span
                                  className={clsx(
                                    isSelected
                                      ? 'font-semibold'
                                      : 'font-normal',
                                    'block truncate',
                                  )}
                                >
                                  {renderOption(option)}
                                </span>
                                {isSelected && (
                                  <span
                                    className={clsx(
                                      active
                                        ? 'text-white'
                                        : 'text-primary-600',
                                      'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" />
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        );
                      })}
                    </Listbox.Options>
                  </div>
                </Transition>
              )}
            </div>
            <Help error={error} help={help} />
          </>
        )}
      </Listbox>
    </div>
  );
}
