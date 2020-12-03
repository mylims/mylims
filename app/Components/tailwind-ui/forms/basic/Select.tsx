import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode, useMemo } from 'react';

import { useSameWidthPopper } from '../../hooks/popper';
import { SvgOutlineCheck } from '../../svg/heroicon/outline';
import { SvgSolidX } from '../../svg/heroicon/solid';

import {
  labelDisabledColor,
  labelColor,
  inputError,
  inputColor,
} from './common';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
}

interface SelectCommonProps {
  help?: string;
  required?: boolean;
  clearable?: boolean;
  placeholder?: string;
  error?: string;
  label?: string;
  className?: string;
  disabled?: boolean;

  inline?: boolean;
}

export interface SelectHelperProps extends SelectCommonProps {
  options: SelectOption[];
  selected?: string;
  onSelect?: (selected: string | undefined) => void;
  inline: boolean;

  highlightColor?: string;
}

function SelectHelper(props: SelectHelperProps) {
  const { highlightColor = 'text-white bg-primary-600' } = props;

  const selectedOption = props.options.find(
    (option) => option.value === props.selected,
  );

  const {
    setReferenceElement,
    setPopperElement,
    popperProps,
  } = useSameWidthPopper({ placement: 'bottom', distance: 5 });
  return (
    <div className={props.className}>
      <Listbox
        as="div"
        className="space-y-1"
        value={props.selected}
        // @ts-expect-error: TODO: check if it's possible to force type using generic
        onChange={(value) =>
          props.disabled ? undefined : props.onSelect?.(value)
        }
      >
        {({ open }) => (
          <>
            <div className="flex items-center justify-between w-full">
              <Listbox.Label
                className={clsx(
                  'block text-sm font-medium',
                  props.disabled ? labelDisabledColor : labelColor,
                )}
              >
                {props.label}
                {props.required && <span className="text-warning-600"> *</span>}
              </Listbox.Label>
              {!props.disabled &&
              props.clearable &&
              props.selected &&
              !props.inline ? (
                <div
                  className="text-xs cursor-pointer text-primary-600"
                  onClick={() => props.onSelect?.(undefined)}
                >
                  Clear
                </div>
              ) : null}
            </div>
            <div ref={setReferenceElement} className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button
                  disabled={props.disabled}
                  className={clsx(
                    'bg-white relative w-full border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm',
                    props.error ? inputError : inputColor,
                  )}
                >
                  <span className="block truncate">
                    {selectedOption?.label || (
                      <span
                        className={
                          props.error ? 'text-danger-300' : 'text-neutral-400'
                        }
                      >
                        {props.placeholder}&nbsp;
                      </span>
                    )}
                  </span>

                  {!props.disabled &&
                    props.clearable &&
                    props.selected &&
                    props.inline && (
                      <div
                        className="absolute inset-y-0 flex items-center mr-2 cursor-pointer right-6"
                        onPointerUp={(event) => {
                          event.stopPropagation();
                          props.onSelect?.(undefined);
                        }}
                      >
                        <SvgSolidX className="w-4 h-4 hover:text-neutral-500 text-neutral-400" />
                      </div>
                    )}

                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-neutral-400"
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

              {!props.disabled && (
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
                      className="py-1 overflow-auto text-base bg-white rounded-md ring-1 ring-black ring-opacity-5 max-h-60 focus:outline-none sm:text-sm"
                    >
                      {props.options.map((option) => (
                        <Listbox.Option key={option.value} value={option.value}>
                          {({ selected, active }) => (
                            <div
                              className={clsx(
                                active ? highlightColor : 'text-neutral-900',
                                'cursor-default select-none relative py-2 pl-8 pr-4',
                              )}
                            >
                              <span
                                className={clsx(
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate',
                                )}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span
                                  className={clsx(
                                    active ? 'text-white' : 'text-primary-600',
                                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                  )}
                                >
                                  <SvgOutlineCheck className="w-5 h-5" />
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Transition>
              )}
              {(props.error || props.help) && (
                <p
                  className={clsx('mt-2 text-sm text-neutral-500', {
                    'text-danger-600': props.error,
                  })}
                >
                  {props.error || props.help}
                </p>
              )}
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}

export interface SelectProps<T> extends BaseSelectProps<T> {
  getValue: (option: T) => string | number;
  renderOption: (option: T) => ReactNode;
}

export interface BaseSelectProps<T> extends SelectCommonProps {
  getValue?: (option: T) => string | number;
  renderOption?: (option: T) => ReactNode;
  options: T[];
  onSelect?: (selected: T | undefined) => void;
  selected: T | undefined;
}

export function Select<T extends SelectOption>(
  props: BaseSelectProps<T>,
): JSX.Element;
export function Select<T>(props: SelectProps<T>): JSX.Element;
export function Select<T>(props: SelectProps<T> | BaseSelectProps<T>) {
  const {
    options,
    selected,
    // @ts-expect-error Cannot deal with types in overloaded function
    getValue = (option) => option.value,
    // @ts-expect-error Cannot deal with types in overloaded function
    renderOption = (option) => option.label,
    onSelect,
    inline = false,
    ...otherProps
  } = props;

  const selectOptions: SelectOption[] = useMemo(() => {
    return options.map((option) => ({
      label: renderOption(option),
      value: getValue(option),
    }));
  }, [options, getValue, renderOption]);

  const selectedOption = useMemo(() => {
    if (selected === undefined) return undefined;
    return options.find((option) => getValue(option) === getValue(selected));
  }, [options, selected, getValue]);

  return (
    <SelectHelper
      inline={inline}
      options={selectOptions}
      selected={selectedOption ? getValue(selectedOption) : undefined}
      onSelect={(selected: string | undefined) => {
        if (selected === undefined) {
          onSelect?.(undefined);
          return;
        }
        const option = options.find((option) => getValue(option) === selected);
        if (!option) {
          throw new Error('Unreachable');
        }
        onSelect?.(option);
      }}
      {...otherProps}
    />
  );
}
