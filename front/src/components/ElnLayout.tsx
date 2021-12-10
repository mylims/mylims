import clsx from 'clsx';
import minimatch from 'minimatch';
import React, { useState, useMemo } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import MenuDropDown from './MenuDropDown';

import { LOGO } from '@/../env';

interface ElnLayoutProps {
  pageTitle?: string;
  children: React.ReactNode;
}

interface RouteType {
  label: string;
  pathname: string;
  pathmatch?: string;
}
const ADMIN_ROUTES: RouteType[] = [
  { label: 'Users', pathname: '/eln/users' },
  {
    label: 'File synchronization',
    pathname: '/fileSync/list',
    pathmatch: '/fileSync/**',
  },
  { label: 'Events', pathname: '/event/list', pathmatch: '/event/**' },
];
const MEMBER_ROUTES: RouteType[] = [
  {
    label: 'Wafers',
    pathname: '/sample/list/wafer',
  },
  {
    label: 'Samples',
    pathname: '/sample/list/sample',
  },
  {
    label: 'Measurements',
    pathname: '/measurement/list',
    pathmatch: '/measurement/**',
  },
];
const ROUTES = [...MEMBER_ROUTES, ...ADMIN_ROUTES];

export default function ElnLayout({ pageTitle, children }: ElnLayoutProps) {
  const router = useHistory();
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuth } = useAuth();

  if (!isAuth) {
    router.push('/login');
    return null;
  }

  const currentTitle =
    pageTitle || ROUTES.find((route) => pathname === route.pathname)?.label;

  return (
    <div>
      <nav className="bg-neutral-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src={LOGO} alt="Logo" className="w-24" />
              </div>
              <div className="hidden md:flex md:flex-row md:w-full">
                <div
                  className="flex items-baseline pr-2 ml-10 space-x-4"
                  style={{ borderRight: '2px solid #4B5563' }}
                >
                  {MEMBER_ROUTES.map((route) => (
                    <RouteLink
                      key={route.pathname}
                      pathname={pathname}
                      route={route}
                    />
                  ))}
                </div>
                <div className="flex items-baseline ml-4 space-x-4">
                  {ADMIN_ROUTES.map((route) => (
                    <RouteLink
                      key={route.pathname}
                      pathname={pathname}
                      route={route}
                    />
                  ))}
                </div>
              </div>
            </div>
            <MenuDropDown />
            <div className="flex -mr-2 md:hidden">
              <button
                className="inline-flex items-center justify-center text-neutral-300"
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

      {currentTitle && (
        <header className="shadow bg-neutral-100">
          <div className="flex items-center px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-tight text-neutral-900">
              {currentTitle}
            </h1>
          </div>
        </header>
      )}
      <main>
        <div className="py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-3 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  );
}

function RouteLink({
  route,
  pathname,
}: {
  route: RouteType;
  pathname: string;
}) {
  const isMatch = minimatch(pathname, route.pathmatch || route.pathname);
  return (
    <Link
      to={route.pathname}
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
}
