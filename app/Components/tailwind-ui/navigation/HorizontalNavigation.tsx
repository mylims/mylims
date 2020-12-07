/* eslint-disable react/no-array-index-key */
import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface HorizontalNavigationOptions<T = string> {
  value: T;
  label?: ReactNode;
}

export interface HorizontalNavigationProps<T> {
  options: Array<HorizontalNavigationOptions<T>>;
  selected: HorizontalNavigationOptions<T> | undefined;
  onSelect: (
    clicked: HorizontalNavigationOptions<T>,
    options: Array<HorizontalNavigationOptions<T>>,
  ) => void;
}

const activated = 'border-primary-500 text-primary-600';
const notActivated =
  'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300';

export function HorizontalNavigation<T>({
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

  return (
    <div>
      <div className="sm:hidden">
        <select
          aria-label="Selected tab"
          onChange={(event) => onSelect(opts[event.target.selectedIndex], opts)}
          className="block w-full py-2 pl-3 pr-10 text-base rounded-md border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          {opts.map((element, index) => (
            <option key={index} selected={element.value === selected?.value}>
              {element.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-neutral-200">
          <nav className="flex -mb-px space-x-8">
            {opts.map((element, index) => (
              <Navigation
                key={index}
                callback={() => onSelect(element, opts)}
                element={element}
                selected={selected}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

interface NavigationProps<T> {
  element: HorizontalNavigationOptions<T>;
  selected: HorizontalNavigationOptions<T> | undefined;
  callback: () => void;
}

function Navigation<T>(props: NavigationProps<T>): JSX.Element {
  const isSelected = props.element.value === props.selected?.value;
  return (
    <span
      onClick={props.callback}
      className={clsx(
        'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
        isSelected ? activated : notActivated,
      )}
    >
      {props.element.label}
    </span>
  );
}
