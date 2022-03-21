import clsx from 'clsx';
import React from 'react';
import { Link, useMatch } from 'react-router-dom';

import { RouteType } from './types';

interface RouteLinkProps {
  route: RouteType;
  couldHaveId?: boolean;
}

export default function RouteLink({ route, couldHaveId }: RouteLinkProps) {
  const match = route.pathmatch ?? route.pathname;
  const isMatch = useMatch(match);
  const isIdMatch = useMatch(`${match}/:id`);
  const isActive = isMatch || (isIdMatch && couldHaveId);

  return (
    <Link
      to={route.pathname}
      className={clsx(
        'rounded-md px-3 py-2 text-sm font-medium focus:outline-none',
        isActive ? 'bg-neutral-900 text-neutral-100' : 'text-neutral-300',
      )}
    >
      {route.label}
    </Link>
  );
}
