import clsx from 'clsx';
import minimatch from 'minimatch';
import React, { useState, useMemo } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import MenuDropDown from './MenuDropDown';
import { ZakodiumSolidSvg } from './tailwind-ui';

interface ElnLayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

export default function ElnLayout({ pageTitle, children }: ElnLayoutProps) {
  const router = useHistory();
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuth } = useAuth();
  const ROUTES = useMemo(() => {
    return [
      {
        label: 'Dashboard',
        pathname: '/eln',
      },
      { label: 'Users', pathname: `/eln/users` },
      {
        label: 'File synchronization',
        pathname: `/fileSync/list`,
        pathmatch: `/fileSync/**`,
      },
      { label: 'Events', pathname: `/event/list`, pathmatch: `/event/**` },
      {
        label: 'Measurements',
        pathname: `/measurement/list`,
        pathmatch: `/measurement/**`,
      },
    ];
  }, []);

  if (!isAuth) {
    router.push('/login');
    return null;
  }

  const currentTitle =
    pageTitle ||
    ROUTES.find((route) => pathname === route.pathname)?.label ||
    'Unknown page title';

  return (
    <div>
      <nav className="bg-neutral-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ZakodiumSolidSvg className="w-24 fill-current text-alternative-100" />
              </div>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10 space-x-4">
                  {ROUTES.map((route) => {
                    const isMatch = minimatch(
                      pathname,
                      route.pathmatch || route.pathname,
                    );
                    return (
                      <Link
                        to={route.pathname}
                        key={route.pathname}
                        className={clsx(
                          'px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
                          {
                            'text-neutral-100 bg-neutral-900': isMatch,
                            'text-neutral-300': !isMatch,
                          },
                        )}
                      >
                        {route.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <MenuDropDown />
            <div className="flex -mr-2 md:hidden">
              <button
                className="inline-flex items-center justify-center"
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <svg
                  className={clsx('h-6 w-6', {
                    hidden: mobileNavOpen,
                    block: !mobileNavOpen,
                  })}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={clsx('h-6 w-6', {
                    block: mobileNavOpen,
                    hidden: !mobileNavOpen,
                  })}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={clsx('md:hidden', {
            hidden: !mobileNavOpen,
            block: mobileNavOpen,
          })}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {ROUTES.map((route) => (
              <Link
                to={route.pathname}
                key={route.pathname}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
                  {
                    'text-neutral-100 bg-neutral-900':
                      pathname === route.pathname,
                    'text-neutral-300': pathname !== route.pathname,
                  },
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <header className="shadow bg-neutral-100">
        <div className="flex items-center px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-neutral-900">
            {currentTitle}
          </h1>
        </div>
      </header>
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
