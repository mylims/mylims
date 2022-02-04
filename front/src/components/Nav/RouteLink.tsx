import clsx from 'clsx';
import React from 'react';
import { Link, useMatch } from 'react-router-dom';

import { RouteType } from './types';

interface RouteLinkProps {
  route: RouteType;
}

export default function RouteLink({ route }: RouteLinkProps) {
  const isMatch = useMatch(route.pathmatch || route.pathname);
  return (
    <Link
      to={route.pathname}
      className={clsx(
        'rounded-md px-3 py-2 text-sm font-medium focus:outline-none',
        isMatch ? 'bg-neutral-900 text-neutral-100' : 'text-neutral-300',
      )}
    >
      {route.label}
    </Link>
  );
}
