/* eslint-disable react/no-array-index-key */
import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { createContext, ReactNode, useContext } from 'react';

import { useOnOff } from '..';

export type HorizontalNavigationRenderOptionCallback<T extends string> = (
  children: ReactNode,
  option: Omit<HorizontalNavigationOption<T>, 'renderOption'> & {
    isSelected: boolean;
  },
) => JSX.Element;

export type HorizontalNavigationRenderNavigationItemCallback<T extends string> =
  (option: HorizontalNavigationOption<T>, index: number) => JSX.Element;

export type HorizontalNavigationRenderSelectedItemCallback<T extends string> = (
  options: Array<HorizontalNavigationOption<T>>,
) => ReactNode;
export interface HorizontalNavigationOption<T extends string> {
  value: T;
  label: ReactNode;
  renderOption?: HorizontalNavigationRenderOptionCallback<T>;
}

const toggleNavigationContext = createContext<{
  isExpanded: boolean;
  toggle: () => void;
} | null>(null);

function useToggleNavigationContext() {
  const context = useContext(toggleNavigationContext);
  if (context === null) {
    throw new Error(
      'this context cannot be used outside of HorizontalNavigation',
    );
  }
  return context;
}

interface HorizontalNavigationProps<T extends string> {
  options: Array<HorizontalNavigationOption<T>>;
  selected: HorizontalNavigationOption<T>;
  onSelect: (
    clicked: HorizontalNavigationOption<T>,
    options: Array<HorizontalNavigationOption<T>>,
  ) => void;
}

export function HorizontalNavigation<T extends string>({
  options,
  selected,
  onSelect,
}: HorizontalNavigationProps<T>) {
  const navItems = (
    <>
      {options.map((element, index) => (
        <HorizontalNavigationItem
          key={index}
          onSelect={() => onSelect(element, options)}
          option={element}
          isSelected={element.value === selected?.value}
        />
      ))}
    </>
  );

  const selectedItem = selected.label || selected.value;
  return (
    <InternalHorizontalNavigation
      navItems={navItems}
      selectedItem={selectedItem}
    />
  );
}
interface UncontrolledHorizontalNavigationProps<T extends string> {
  options: Array<HorizontalNavigationOption<T>>;
  renderNavigationItem: HorizontalNavigationRenderNavigationItemCallback<T>;
  renderSelectedOption: HorizontalNavigationRenderSelectedItemCallback<T>;
}
export function UncontrolledHorizontalNavigation<T extends string>({
  options,
  renderNavigationItem,
  renderSelectedOption,
}: UncontrolledHorizontalNavigationProps<T>) {
  const navItems = (
    <>{options.map((element, index) => renderNavigationItem(element, index))}</>
  );
  const selectedItem = renderSelectedOption(options);

  return (
    <InternalHorizontalNavigation
      navItems={navItems}
      selectedItem={selectedItem}
    />
  );
}

interface InternalHorizontalNavigationProps {
  navItems: ReactNode;
  selectedItem: ReactNode;
}
function InternalHorizontalNavigation({
  navItems,
  selectedItem,
}: InternalHorizontalNavigationProps): JSX.Element {
  const [isExpanded, , , toggleExpansion] = useOnOff();
  return (
    <toggleNavigationContext.Provider
      value={{ isExpanded, toggle: toggleExpansion }}
    >
      <div className="sm:hidden">
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <ShowNavButton
                  onCollapse={toggleExpansion}
                  isExpanded={isExpanded}
                />
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center text-neutral-800 ">
                  {selectedItem}
                </div>
              </div>
            </div>
            <div className={clsx('sm:hidden', { hidden: !isExpanded })}>
              <div className="pt-2 pb-4">{navItems}</div>
            </div>
          </div>
        </nav>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-8">{navItems}</nav>
        </div>
      </div>
    </toggleNavigationContext.Provider>
  );
}

export interface HorizontalNavigationItemProps<T extends string> {
  option: HorizontalNavigationOption<T>;
  isSelected: boolean;
  onSelect?: () => void;
  renderOption?: HorizontalNavigationRenderOptionCallback<T>;
}

function HorizontalNavigationItemSmallScreen<T extends string>(
  props: HorizontalNavigationItemProps<T>,
) {
  const { toggle } = useToggleNavigationContext();
  const option = (
    <div
      onClick={() => {
        props.onSelect?.();
        toggle();
      }}
      className={clsx(
        'cursor-pointer border-l-4 py-2 pl-3 pr-4 text-base font-medium transition duration-150 ease-in-out focus:outline-none',
        {
          'border-primary-500 bg-primary-50 text-primary-700 focus:border-primary-700 focus:bg-primary-100 focus:text-primary-800':
            props.isSelected,
          'mt-1 border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 focus:border-neutral-300 focus:bg-neutral-50 focus:text-neutral-800':
            !props.isSelected,
        },
      )}
    >
      {props.option.label}
    </div>
  );
  const renderOption = props.renderOption || props.option.renderOption;
  return renderOption
    ? renderOption(option, {
        ...props.option,
        isSelected: props.isSelected,
      })
    : option;
}

function HorizontalNavigationItemLargeScreen<T extends string>(
  props: HorizontalNavigationItemProps<T>,
) {
  const option = (
    <div
      onClick={props.onSelect}
      className={clsx(
        'inline-block cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold',
        props.isSelected
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
      )}
    >
      {props.option.label}
    </div>
  );

  const renderOption = props.renderOption || props.option.renderOption;
  return renderOption
    ? renderOption(option, {
        ...props.option,
        isSelected: props.isSelected,
      })
    : option;
}

export function HorizontalNavigationItem<T extends string>(
  props: HorizontalNavigationItemProps<T>,
): JSX.Element {
  return (
    <>
      <div className="hidden sm:block">
        <HorizontalNavigationItemLargeScreen<T> {...props} />
      </div>
      <div className="sm:hidden">
        <HorizontalNavigationItemSmallScreen<T> {...props} />
      </div>
    </>
  );
}

function ShowNavButton({
  onCollapse,
  isExpanded,
}: {
  onCollapse?: () => void;
  isExpanded: boolean;
}) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:outline-none"
      aria-expanded={isExpanded}
      type="button"
      onClick={onCollapse}
    >
      <MenuIcon className="h-6 w-6" />
    </button>
  );
}
