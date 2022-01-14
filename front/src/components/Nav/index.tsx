import { Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import React, { Fragment, useState } from 'react';

import { LOGO } from '@/../env';
import { RouteMenu } from '@/components/Nav/RouteMenu';

import MenuDropDown from '../MenuDropDown';

export default function TestHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="bg-neutral-800">
      <div className="px-4 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="shrink-0">
            <img src={LOGO} alt="Logo" className="w-24" />
          </div>

          <div className="hidden md:flex space-x-10">
            <RouteMenu />
          </div>
          <div className="flex">
            <div className="-mr-2 -my-2 md:hidden">
              <button
                className="bg-neutral-800 rounded-md p-2 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-alternative-500"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                type="button"
              >
                {!mobileNavOpen ? (
                  <>
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            <MenuDropDown />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        show={mobileNavOpen}
      >
        <div className="flex space-x-5 md:hidden">
          <RouteMenu />
        </div>
      </Transition>
    </nav>
  );
}
