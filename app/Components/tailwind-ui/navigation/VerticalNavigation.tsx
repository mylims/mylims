import clsx from 'clsx';
import React, { ReactNode, useMemo } from 'react';

import { useVerticalNavigationCollapse } from '../hooks/useVerticalNavigationCollapse';

export type VerticalNavigationRenderOptionCallback<T> = (
  children: ReactNode,
  option: Omit<VerticalNavigationOption<T>, 'renderOption'> & {
    isSelected: boolean;
  },
) => ReactNode;
export interface VerticalNavigationGroupOption<T> {
  type: 'group';
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  options: VerticalNavigationOption<T>[];
}

export interface VerticalNavigationOption<T> {
  type: 'option';
  id: string;
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  renderOption?: VerticalNavigationRenderOptionCallback<T>;
}

export type VerticalNavigationOptions<T> =
  | VerticalNavigationGroupOption<T>
  | VerticalNavigationOption<T>;

export type VerticalNavigationSize = 'small' | 'base';

export interface VerticalNavigationProps<T> {
  options: Array<VerticalNavigationOptions<T>>;
  selected: VerticalNavigationOption<T> | undefined;
  onSelect?: SelectOptionCallback<T>;
  size?: VerticalNavigationSize;
  autoCollapse?: boolean;
}

type SelectOptionCallback<T> = (selected: VerticalNavigationOption<T>) => void;

const optionStyles = {
  small: 'text-neutral-600 hover:text-neutral-900 text-sm',
  base: 'text-neutral-900 text-base',
};

const iconStyles = {
  small: 'text-neutral-400 mr-3',
  base: 'text-neutral-500 mr-4',
};

export function VerticalNavigation<T>(
  props: VerticalNavigationProps<T>,
): JSX.Element {
  const { onSelect, selected, options, size, autoCollapse = false } = props;

  const opts = useMemo(() => {
    return options.map((element) => {
      if (element.type === 'option') {
        return {
          ...element,
          label: element.label || element.value,
        };
      }
      return element;
    });
  }, [options]);

  const navigation = useVerticalNavigationCollapse(opts, {
    autoCollapse,
    selected,
  });

  let chosenSize = size ? size : 'small';
  return (
    <div className="flex flex-col flex-grow mt-5">
      <nav className="flex-1 px-2 space-y-1">
        {opts.map((element) => {
          if (element.type === 'option') {
            return (
              <Navigation
                key={element.id}
                onSelect={() => onSelect?.(element)}
                element={element}
                selected={selected}
                offset={false}
                size={chosenSize}
                renderOption={element.renderOption}
              />
            );
          } else {
            return (
              <NavigationGroup
                key={element.id}
                element={element}
                selected={selected}
                size={chosenSize}
                onSelect={onSelect}
                {...navigation}
              />
            );
          }
        })}
      </nav>
    </div>
  );
}

interface NavigationProps<T> {
  element: VerticalNavigationOption<T>;
  selected: VerticalNavigationOption<T> | undefined;
  onSelect: () => void;
  offset: boolean;
  size: VerticalNavigationSize;
  renderOption?: VerticalNavigationRenderOptionCallback<T>;
}

interface NavigationGroupProps<T> {
  element: VerticalNavigationGroupOption<T>;
  selected?: VerticalNavigationOption<T>;
  onSelect?: SelectOptionCallback<T>;
  size: VerticalNavigationSize;
  toggleElement: (element: VerticalNavigationGroupOption<T>) => void;
  isElementOpen: (element: VerticalNavigationGroupOption<T>) => boolean;
}

function NavigationGroup<T>(props: NavigationGroupProps<T>): JSX.Element {
  const {
    element,
    selected,
    onSelect,
    size,
    toggleElement,
    isElementOpen,
  } = props;

  const isOpen = isElementOpen(element);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => toggleElement(element)}
        className={clsx(
          'flex items-center w-full pl-2 pr-1 py-2 bg-white rounded-md group hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
          optionStyles[size],
        )}
      >
        {element.icon && (
          <div
            className={clsx(
              'w-6 h-6 text-2xl text-neutral-400 group-hover:text-neutral-600',
              iconStyles[size],
            )}
          >
            {props.element.icon}
          </div>
        )}

        {element.label}
        <svg
          className={clsx(
            'ml-auto h-5 w-5 transform group-hover:text-neutral-400 transition-colors ease-in-out duration-150',
            isOpen ? 'text-neutral-500 rotate-90' : 'text-neutral-300',
          )}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
        </svg>
      </button>
      {isOpen
        ? element.options.map((element) => (
            <Navigation
              key={element.id}
              element={element}
              selected={selected}
              onSelect={() => onSelect?.(element)}
              offset
              size={size}
              renderOption={element.renderOption}
            />
          ))
        : null}
    </div>
  );
}

function Navigation<T>(props: NavigationProps<T>): JSX.Element {
  const isSelected =
    props.selected !== undefined &&
    props.element.value === props.selected.value;

  const item = (
    <span
      onClick={props.onSelect}
      className={clsx(
        'group w-full flex items-center py-2 rounded-md cursor-pointer hover:bg-neutral-100',
        optionStyles[props.size],
        isSelected ? 'bg-neutral-100' : 'bg-white',
        props.offset ? 'pl-11' : 'pl-2',
      )}
    >
      {props.element.icon && (
        <div
          className={clsx(
            'w-6 h-6 group-hover:text-neutral-600',
            iconStyles[props.size],
          )}
        >
          {props.element.icon}
        </div>
      )}
      {props.element.label}
    </span>
  );

  const toRender = props.renderOption
    ? props.renderOption(item, {
        ...props.element,
        isSelected,
      })
    : item;

  return <div className="space-y-1">{toRender}</div>;
}
