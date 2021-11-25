import { Transition } from '@headlessui/react';
import { MenuAlt1Icon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ReactNode, useEffect } from 'react';

export interface SidebarLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  revealOnLargeViewport?: boolean;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export function SidebarLayout(props: SidebarLayoutProps) {
  const {
    open,
    close,
    isOpen,
    header,
    sidebar,
    children,
    revealOnLargeViewport = true,
  } = props;
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Transition
        show={isOpen}
        className={revealOnLargeViewport ? 'lg:hidden' : undefined}
      >
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
            className="relative flex flex-col flex-1 w-full h-full max-w-xs bg-white"
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
                <XIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="h-full">{sidebar}</div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" />
        </div>
      </Transition>

      <div
        className={clsx('hidden', {
          'lg:flex lg:flex-shrink-0': revealOnLargeViewport,
        })}
      >
        <div className="flex flex-col w-64 bg-white border-r border-neutral-200">
          {sidebar}
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-auto focus:outline-none">
        <div className="relative z-10 flex flex-shrink-0 bg-white border-b border-neutral-200">
          <button
            type="button"
            className={clsx(
              'px-4 border-r text-neutral-400 border-neutral-200 focus:outline-none focus:bg-neutral-100 focus:text-neutral-600',
              { 'lg:hidden': revealOnLargeViewport },
            )}
            aria-label="Open sidebar"
            onClick={open}
          >
            <MenuAlt1Icon className="w-6 h-6 transition duration-150 ease-in-out" />
          </button>
          <div className="flex justify-between flex-1">{header}</div>
        </div>
        <main className="relative z-0 flex flex-col flex-1 pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
