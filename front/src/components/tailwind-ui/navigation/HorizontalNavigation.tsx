/* eslint-disable react/no-array-index-key */
import clsx from 'clsx';
import React, { ReactNode } from 'react';

export type HorizontalNavigationRenderOptionCallback<T extends string> = (
  children: ReactNode,
  option: Omit<HorizontalNavigationOption<T>, 'renderOption'> & {
    isSelected: boolean;
  },
) => JSX.Element;
export interface HorizontalNavigationOption<T extends string> {
  value: T;
  label: ReactNode;
  renderOption?: HorizontalNavigationRenderOptionCallback<T>;
}

export interface HorizontalNavigationProps<T extends string> {
  options: Array<HorizontalNavigationOption<T>>;
  selected: HorizontalNavigationOption<T> | undefined;
  onSelect?: (
    clicked: HorizontalNavigationOption<T>,
    options: Array<HorizontalNavigationOption<T>>,
  ) => void;
}

const activated = 'border-primary-500 text-primary-600';
const notActivated =
  'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300';

export function HorizontalNavigation<T extends string>({
  options,
  selected,
  onSelect,
}: HorizontalNavigationProps<T>): JSX.Element {
  const opts = options.map((element) => {
    return {
      ...element,
      label: element.label || element.value,
    };
  });

  const select = opts.find((element) => element.value === selected?.value);
  return (
    <div>
      <div className="sm:hidden">
        <select
          value={select?.value}
          aria-label="Selected tab"
          onChange={(event) =>
            onSelect?.(opts[event.target.selectedIndex], opts)
          }
          className="block w-full rounded-md border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          {opts.map((element, index) => (
            <option key={index} value={element.value}>
              {element.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-8">
            {opts.map((element, index) => (
              <Navigation
                key={index}
                onSelect={() => onSelect?.(element, opts)}
                element={element}
                selected={selected}
                renderOption={element.renderOption}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

interface NavigationProps<T extends string> {
  element: HorizontalNavigationOption<T>;
  selected: HorizontalNavigationOption<T> | undefined;
  onSelect: () => void;
  renderOption?: HorizontalNavigationRenderOptionCallback<T>;
}

function Navigation<T extends string>(props: NavigationProps<T>): JSX.Element {
  const isSelected = props.element.value === props.selected?.value;
  const option = (
    <div
      onClick={props.onSelect}
      className={clsx(
        'inline-block cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold',
        isSelected ? activated : notActivated,
      )}
    >
      {props.element.label}
    </div>
  );

  return props.renderOption
    ? props.renderOption(option, {
        ...props.element,
        isSelected,
      })
    : option;
}
