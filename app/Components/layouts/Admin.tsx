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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="sm:block sm:ml-6">
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
        'ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5',
        props.currentUrl === props.href
          ? 'text-white bg-neutral-900 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out'
          : 'text-neutral-300 hover:text-white hover:bg-neutral-700 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out',
      )}
    >
      {props.label}
    </a>
  );
}
