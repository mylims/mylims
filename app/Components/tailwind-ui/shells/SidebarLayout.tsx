import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode, useEffect, ReactElement } from 'react';

import { useOnOff } from '../hooks/useOnOff';
import { SvgOutlineMenuAlt1, SvgOutlineX } from '../svg/heroicon/outline';

interface SidebarLayoutProps {
  children: ReactElement[];
}

export function SidebarLayout(props: SidebarLayoutProps) {
  const [isOpen, open, close] = useOnOff();
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  const sidebar = props.children.find(
    (child) => child.type === SidebarLayout.Sidebar,
  );
  const header = props.children.find(
    (child) => child.type === SidebarLayout.Header,
  );
  const body = props.children.find(
    (child) => child.type === SidebarLayout.Body,
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Transition show={isOpen} className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0"
            onClick={close}
          >
            <div className="absolute inset-0 opacity-75 bg-neutral-600" />
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            className="relative flex flex-col flex-1 w-full h-full max-w-xs pt-5 pb-4 bg-white"
          >
            <div className="absolute top-0 right-0 p-1 -mr-14">
              <button
                type="button"
                className={clsx(
                  'flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-neutral-600',
                  {
                    hidden: !isOpen,
                  },
                )}
                aria-label="Close sidebar"
                onClick={close}
              >
                <SvgOutlineX className="w-6 h-6 text-white" />
              </button>
            </div>
            <div>{sidebar}</div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" />
        </div>
      </Transition>

      <div className="hidden lg:flex lg:flex-shrink-0 border-">
        <div className="flex flex-col w-64 pt-5 pb-4 bg-white border-r border-neutral-200">
          {sidebar}
        </div>
      </div>
      <div
        className="flex flex-col flex-1 overflow-auto focus:outline-none"
        tabIndex={0}
      >
        <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-neutral-200">
          <button
            type="button"
            className="px-4 border-r text-neutral-400 border-neutral-200 focus:outline-none focus:bg-neutral-100 focus:text-neutral-600 lg:hidden"
            aria-label="Open sidebar"
            onClick={open}
          >
            <SvgOutlineMenuAlt1 className="w-6 h-6 transition duration-150 ease-in-out" />
          </button>
          <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </div>
        <main className="relative z-0 flex-1 pb-8 overflow-y-auto">
          <div className="px-4 mt-8 sm:px-6 lg:px-8">{body}</div>
        </main>
      </div>
    </div>
  );
}

interface SidebarLayoutChildProps {
  children: ReactNode;
}

SidebarLayout.Sidebar = function (props: SidebarLayoutChildProps) {
  return <>{props.children}</>;
};

SidebarLayout.Header = function (props: SidebarLayoutChildProps) {
  return <>{props.children}</>;
};

SidebarLayout.Body = function (props: SidebarLayoutChildProps) {
  return <>{props.children}</>;
};
