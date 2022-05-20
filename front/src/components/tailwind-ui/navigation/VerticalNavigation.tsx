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
  startUncollapsed?: boolean;
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
  const {
    onSelect,
    selected,
    options,
    size,
    autoCollapse = false,
    startUncollapsed = false,
  } = props;

  const opts = useMemo(() => {
    return options.map((element): VerticalNavigationOptions<T> => {
      if (element.type === 'option') {
        return {
          ...element,
          // TODO: `element.value` could be anything.
          label: (element.label || element.value) as ReactNode,
        };
      }
      return element;
    });
  }, [options]);

  const navigation = useVerticalNavigationCollapse(opts, {
    autoCollapse,
    selected,
    startUncollapsed,
  });

  let chosenSize = size ? size : 'small';
  return (
    <div className="mt-5 flex grow flex-col">
      <nav className="flex-1 space-y-1 px-2">
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
  const { element, selected, onSelect, size, toggleElement, isElementOpen } =
    props;

  const isOpen = isElementOpen(element);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => toggleElement(element)}
        className={clsx(
          'group flex w-full items-center rounded-md bg-white py-2 pl-2 pr-1 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
          optionStyles[size],
        )}
      >
        {element.icon && (
          <div
            className={clsx(
              'h-6 w-6 text-2xl text-neutral-400 group-hover:text-neutral-600',
              iconStyles[size],
            )}
          >
            {props.element.icon}
          </div>
        )}

        {element.label}
        <svg
          className={clsx(
            'ml-auto h-5 w-5 transition-colors duration-150 ease-in-out group-hover:text-neutral-400',
            isOpen ? 'rotate-90 text-neutral-500' : 'text-neutral-300',
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
        'group flex w-full cursor-pointer items-center rounded-md py-2 hover:bg-neutral-100',
        optionStyles[props.size],
        isSelected ? 'bg-neutral-100' : 'bg-white',
        props.offset ? 'pl-11' : 'pl-2',
      )}
    >
      {props.element.icon && (
        <div
          className={clsx(
            'h-6 w-6 group-hover:text-neutral-600',
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
