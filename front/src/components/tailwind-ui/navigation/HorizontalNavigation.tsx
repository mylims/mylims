/* eslint-disable react/no-array-index-key */
import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
} from 'react';

import { useOnOff } from '..';
import { IconButton } from '../elements/buttons/IconButton';

export type HorizontalNavigationRenderOptionCallback<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> = (
  Component: ComponentType<{ children?: ReactNode }>,
  option: Omit<U, 'renderOption'> & {
    isSelected: boolean;
  },
) => JSX.Element;

export type HorizontalNavigationRenderNavigationItemCallback<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> = (option: U, index: number) => JSX.Element;

export type HorizontalNavigationRenderSelectedItemCallback<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> = (options: Array<U>) => ReactNode;
export interface HorizontalNavigationOption<T extends string> {
  value: T;
  label: ReactNode;
  renderOption?: HorizontalNavigationRenderOptionCallback<T>;
}

const toggleNavigationContext = createContext<{
  isExpanded: boolean;
  close: () => void;
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

interface HorizontalNavigationProps<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> {
  options: Array<U>;
  selected: U;
  onSelect: (clicked: U, options: Array<U>) => void;
}

export function HorizontalNavigation<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
>({ options, selected, onSelect }: HorizontalNavigationProps<T, U>) {
  const navItems = (
    <>
      {options.map((element, index) => (
        <HorizontalNavigationItem<T, U>
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
interface UncontrolledHorizontalNavigationProps<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> {
  options: Array<U>;
  renderNavigationItem: HorizontalNavigationRenderNavigationItemCallback<T, U>;
  renderSelectedOption: () => ReactNode;
  bare?: boolean;
}
export function UncontrolledHorizontalNavigation<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
>({
  options,
  renderNavigationItem,
  renderSelectedOption,
  bare,
}: UncontrolledHorizontalNavigationProps<T, U>) {
  const navItems = (
    <>{options.map((element, index) => renderNavigationItem(element, index))}</>
  );
  const selectedItem = renderSelectedOption();

  return (
    <InternalHorizontalNavigation
      navItems={navItems}
      selectedItem={selectedItem}
      bare={bare}
    />
  );
}

interface InternalHorizontalNavigationProps {
  navItems: ReactNode;
  selectedItem: ReactNode;
  bare?: boolean;
}

function InternalHorizontalNavigation({
  navItems,
  selectedItem,
  bare,
}: InternalHorizontalNavigationProps): JSX.Element {
  const [isExpanded, , close, toggle] = useOnOff();
  return (
    <toggleNavigationContext.Provider value={{ isExpanded, close }}>
      <div className="sm:hidden">
        <nav className={clsx('bg-white', { shadow: !bare })}>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between gap-2">
              <div className="flex items-center">
                <ShowNavButton onCollapse={toggle} isExpanded={isExpanded} />
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex w-full flex-1 items-center text-neutral-800">
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
        <div className={clsx({ 'border-b border-neutral-200': !bare })}>
          <nav className="-mb-px flex space-x-8">{navItems}</nav>
        </div>
      </div>
    </toggleNavigationContext.Provider>
  );
}

export interface HorizontalNavigationItemProps<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
> {
  option: U;
  isSelected: boolean;
  onSelect?: () => void;
  renderOption?: HorizontalNavigationRenderOptionCallback<T, U>;
}

const baseOptionContext = createContext<{
  isSelected: boolean;
  onSelect?: () => void;
}>({ isSelected: false });

interface BaseOptionScreenProps {
  children?: ReactNode;
}

function BaseOptionSmallScreen({ children }: BaseOptionScreenProps) {
  const { close } = useToggleNavigationContext();
  const { isSelected, onSelect } = useContext(baseOptionContext);
  return (
    <div
      onClick={() => {
        onSelect?.();
        close();
      }}
      className={clsx(
        'cursor-pointer border-l-4 py-2 pl-3 pr-4 text-base font-medium transition duration-150 ease-in-out focus:outline-none',
        {
          'border-primary-500 bg-primary-50 text-primary-700 focus:border-primary-700 focus:bg-primary-100 focus:text-primary-800':
            isSelected,
          'mt-1 border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 focus:border-neutral-300 focus:bg-neutral-50 focus:text-neutral-800':
            !isSelected,
        },
      )}
    >
      {children}
    </div>
  );
}

function HorizontalNavigationItemSmallScreen<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
>(props: HorizontalNavigationItemProps<T, U>) {
  const renderOption = props.renderOption || props.option.renderOption;
  return (
    <baseOptionContext.Provider
      value={{ isSelected: props.isSelected, onSelect: props.onSelect }}
    >
      {renderOption ? (
        renderOption(BaseOptionSmallScreen, {
          ...props.option,
          isSelected: props.isSelected,
        })
      ) : (
        <BaseOptionSmallScreen>{props.option.label}</BaseOptionSmallScreen>
      )}
    </baseOptionContext.Provider>
  );
}

function BaseOptionLargeScreen({ children }: BaseOptionScreenProps) {
  const { close } = useToggleNavigationContext();
  const { onSelect } = useContext(baseOptionContext);
  return (
    <div
      onClick={() => {
        onSelect?.();
        close();
      }}
      className={clsx(
        'inline-block cursor-pointer whitespace-nowrap py-4 px-1 text-sm font-semibold',
      )}
    >
      {children}
    </div>
  );
}

function HorizontalNavigationItemLargeScreen<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
>(props: HorizontalNavigationItemProps<T, U>) {
  const renderOption = props.renderOption || props.option.renderOption;

  return (
    <baseOptionContext.Provider
      value={{ onSelect: props.onSelect, isSelected: props.isSelected }}
    >
      {renderOption ? (
        renderOption(BaseOptionLargeScreen, {
          ...props.option,
          isSelected: props.isSelected,
        })
      ) : (
        <BaseOptionLargeScreen>{props.option.label}</BaseOptionLargeScreen>
      )}
    </baseOptionContext.Provider>
  );
}

export function HorizontalNavigationItem<
  T extends string,
  U extends HorizontalNavigationOption<T> = HorizontalNavigationOption<T>,
>(props: HorizontalNavigationItemProps<T, U>): JSX.Element {
  return (
    <>
      <div
        className={clsx(
          'hidden border-b-2 sm:block',
          props.isSelected
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
        )}
      >
        <HorizontalNavigationItemLargeScreen<T, U> {...props} />
      </div>
      <div
        className={clsx(
          'sm:hidden',
          props.isSelected
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
        )}
      >
        <HorizontalNavigationItemSmallScreen<T, U> {...props} />
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
    <IconButton
      aria-expanded={isExpanded}
      className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:outline-none"
      icon={<MenuIcon />}
      size="6"
      onClick={onCollapse}
    />
  );
}
