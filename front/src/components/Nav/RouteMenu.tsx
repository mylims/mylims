import React from 'react';

import RouteLink from '@/components/Nav/RouteLink';

import { Menu } from './Menu';
import { RouteType } from './types';

const ADMIN_ROUTES: RouteType[] = [
  { label: 'Users', pathname: '/users' },
  {
    label: 'File synchronization',
    pathname: '/fileSync/list',
    pathmatch: '/fileSync/*',
  },
  { label: 'Events', pathname: '/event/list', pathmatch: '/event/*' },
];

export function RouteMenu() {
  return (
    <>
      <RouteLink
        couldHaveId
        route={{
          label: 'Wafers',
          pathname: '/sample/list/wafer',
          pathmatch: '/sample/:action/wafer',
        }}
      />
      <RouteLink
        couldHaveId
        route={{
          label: 'Samples',
          pathname: '/sample/list/sample',
          pathmatch: '/sample/:action/sample',
        }}
      />
      <RouteLink
        couldHaveId
        route={{
          label: 'Dyes',
          pathname: '/sample/list/dye',
          pathmatch: '/sample/:action/dye',
        }}
      />
      <RouteLink
        couldHaveId
        route={{
          label: 'Devices',
          pathname: '/sample/list/device',
          pathmatch: '/sample/:action/device',
        }}
      />
      <RouteLink
        route={{
          label: 'Measurements',
          pathname: '/measurement/list',
          pathmatch: '/measurement/*',
        }}
      />
      <Menu title="Admin" routes={ADMIN_ROUTES} />
    </>
  );
}
