import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { SvgSolidChevronDown } from '../../svg/heroicon/solid';

export interface DropdownOption<T> {
  type: 'option';
  icon?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
  data?: T;
}

export type DropdownElement<T> = DropdownOption<T> | DropdownStaticOption;

export interface DropdownStaticOption {
  type: 'static';
  content: ReactNode;
}

export interface DropdownProps<T> {
  children?: ReactNode;
  title?: string;
  options: DropdownElement<T>[][];
  onSelect: (selected: DropdownOption<T>) => void;
}

const titleClassName =
  'inline-flex justify-center w-full rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 focus:ring-primary-500';
const iconClassName =
  'rounded-full flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 focus:ring-primary-500';

export function Dropdown<T>(props: DropdownProps<T>): React.ReactElement {
  return (
    <div className="relative inline-block text-left">
      <Menu>
        {(menu) => (
          <>
            <Menu.Button
              className={props.children ? iconClassName : titleClassName}
            >
              {props.children ? (
                props.children
              ) : (
                <>
                  {props.title}
                  <SvgSolidChevronDown className="w-5 h-5 ml-2 -mr-1" />
                </>
              )}
            </Menu.Button>

            <Transition
              show={menu.open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg focus:outline-none ring-1 ring-black ring-opacity-5"
              >
                <div className="py-1 divide-y divide-neutral-100" role="menu">
                  {props.options.map((options, index1) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className="py-1" key={index1}>
                      {options.map((option, index2) => {
                        if (option.type === 'option') {
                          return (
                            <Menu.Item
                              disabled={option.disabled}
                              onClick={() => props.onSelect(option)}
                              // eslint-disable-next-line react/no-array-index-key
                              key={`${index1}-${index2}`}
                            >
                              {({ active }) => (
                                <div
                                  className={clsx(
                                    'focus:outline-none',
                                    option.disabled
                                      ? 'text-neutral-400'
                                      : 'text-neutral-700',
                                    {
                                      'bg-neutral-100 text-neutral-900': active,
                                    },
                                  )}
                                >
                                  <span
                                    className={clsx(
                                      'w-full text-left block px-4 py-2 text-sm focus:outline-none',
                                      option.disabled
                                        ? 'cursor-default'
                                        : 'cursor-pointer',
                                      {
                                        'group flex items-center': option.icon,
                                        'block justify-between ': !option.icon,
                                      },
                                    )}
                                  >
                                    {option.icon !== undefined && (
                                      <span
                                        className={clsx(
                                          'text-xl mr-3',
                                          active
                                            ? 'text-neutral-500'
                                            : ' text-neutral-400',
                                        )}
                                      >
                                        {option.icon}
                                      </span>
                                    )}
                                    {option.label}
                                  </span>
                                </div>
                              )}
                            </Menu.Item>
                          );
                        } else {
                          return (
                            <div
                              className="px-4 py-2 text-sm"
                              // eslint-disable-next-line react/no-array-index-key
                              key={`${index1}-${index2}`}
                            >
                              {option.content}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
