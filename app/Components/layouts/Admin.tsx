import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { useAdonisContext } from '@ioc:React';

import { useBackendUrl } from '../hooks/useBackendUrl';

import Base from './Base';

export default function Admin(props: { children: ReactNode }) {
  const { request } = useAdonisContext();

  const backendUrl = useBackendUrl();
  const currentUrl = backendUrl + request.url();

  return (
    <Base>
      <nav className="bg-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="sm:ml-6 sm:block">
                <div className="flex">
                  <NavLink
                    href={`${backendUrl}/admin/config`}
                    label="Configuration"
                    currentUrl={currentUrl}
                  />
                  <NavLink
                    href={`${backendUrl}/admin/addons`}
                    label="Addons"
                    currentUrl={currentUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {props.children}
    </Base>
  );
}

function NavLink(props: { href: string; label: string; currentUrl: string }) {
  return (
    <a
      href={props.href}
      className={clsx(
        'ml-4 rounded-md px-3 py-2 text-sm font-medium leading-5',
        props.currentUrl === props.href
          ? 'bg-neutral-900 text-white transition duration-150 ease-in-out focus:bg-neutral-700 focus:text-white focus:outline-none'
          : 'text-neutral-300 transition duration-150 ease-in-out hover:bg-neutral-700 hover:text-white focus:bg-neutral-700 focus:text-white focus:outline-none',
      )}
    >
      {props.label}
    </a>
  );
}
