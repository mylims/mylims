import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { RequestContract } from '@ioc:Adonis/Core/Request';

export default function Admin(props: {
  request: RequestContract;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>System configuration</title>
        <link rel="stylesheet" href="/tailwind.out.css" />
      </head>
      <body>
        <nav className="bg-neutral-800">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="sm:block sm:ml-6">
                  <div className="flex">
                    <a
                      href="/admin/config"
                      className={clsx(
                        'ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5',
                        props.request.url() === '/admin/config'
                          ? 'text-white bg-neutral-900 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-700 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out',
                      )}
                    >
                      Configuration
                    </a>
                    <a
                      href="/admin/addons"
                      className={clsx(
                        'ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5',
                        props.request.url() === '/admin/addons'
                          ? 'text-white bg-neutral-900 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-700 focus:outline-none focus:text-white focus:bg-neutral-700 transition duration-150 ease-in-out',
                      )}
                    >
                      Addons
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {props.children}
      </body>
    </html>
  );
}
