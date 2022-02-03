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
      <RouteLink route={{ label: 'Wafers', pathname: '/sample/list/wafer' }} />
      <RouteLink
        route={{ label: 'Samples', pathname: '/sample/list/sample' }}
      />
      <RouteLink route={{ label: 'Dyes', pathname: '/sample/list/dye' }} />
      <RouteLink
        route={{ label: 'Devices', pathname: '/sample/list/device' }}
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
