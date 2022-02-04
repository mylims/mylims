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
            <div className="absolute inset-0 bg-neutral-600 opacity-75" />
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            className="relative flex h-full w-full max-w-xs flex-1 flex-col bg-white"
          >
            <div className="absolute top-0 right-0 -mr-14 p-1">
              <button
                type="button"
                className={clsx(
                  'flex h-12 w-12 items-center justify-center rounded-full focus:bg-neutral-600 focus:outline-none',
                  {
                    hidden: !isOpen,
                  },
                )}
                aria-label="Close sidebar"
                onClick={close}
              >
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-full overflow-auto">{sidebar}</div>
          </Transition.Child>
          <div className="w-14 shrink-0" />
        </div>
      </Transition>

      <div
        className={clsx('hidden', {
          'lg:flex lg:shrink-0': revealOnLargeViewport,
        })}
      >
        <div className="flex w-64 flex-col overflow-auto border-r border-neutral-200 bg-white">
          {sidebar}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto focus:outline-none">
        <div className="relative z-10 flex shrink-0 border-b border-neutral-200 bg-white">
          <button
            type="button"
            className={clsx(
              'border-r border-neutral-200 px-4 text-neutral-400 focus:bg-neutral-100 focus:text-neutral-600 focus:outline-none',
              { 'lg:hidden': revealOnLargeViewport },
            )}
            aria-label="Open sidebar"
            onClick={open}
          >
            <MenuAlt1Icon className="h-6 w-6 transition duration-150 ease-in-out" />
          </button>
          <div className="flex flex-1 justify-between">{header}</div>
        </div>
        <main className="relative z-0 flex flex-1 flex-col overflow-y-auto pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
