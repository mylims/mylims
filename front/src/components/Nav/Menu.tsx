import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import React, { Fragment } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import RouteLink from '@/components/Nav/RouteLink';

import { RouteType } from './types';

interface MenuProps {
  title: string;
  routes: RouteType[];
}

export function Menu({ title, routes }: MenuProps) {
  const { pathname } = useLocation();
  const isMatch = routes.reduce(
    (acc, route) =>
      acc || !!matchPath(pathname, route.pathmatch || route.pathname),
    false,
  );
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={clsx(
              open ? 'text-neutral-100' : 'text-neutral-300',
              isMatch ? 'bg-neutral-900 text-neutral-100' : 'text-neutral-300',
              'group inline-flex items-center rounded-md p-2 text-sm font-medium hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-alternative-500 focus:ring-offset-2',
            )}
          >
            <span>{title}</span>
            <ChevronDownIcon
              className={clsx(
                open ? 'text-neutral-600' : 'text-neutral-400',
                'ml-2 h-5 w-5 group-hover:text-neutral-500',
              )}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 mt-3 -ml-4 w-screen max-w-xs transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-neutral-600 px-5 py-6 sm:gap-8 sm:p-8">
                  {routes.map((route) => (
                    <RouteLink key={route.pathname} route={route} />
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
