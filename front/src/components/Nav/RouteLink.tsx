import clsx from 'clsx';
import minimatch from 'minimatch';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';

import { RouteType } from './types';

interface RouteLinkProps {
  route: RouteType;
}

export default function RouteLink({ route }: RouteLinkProps) {
  const { pathname } = useLocation();
  const isMatch = minimatch(pathname, route.pathmatch || route.pathname);
  console.log({ isMatch, pathname, route: route.pathmatch || route.pathname });
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
