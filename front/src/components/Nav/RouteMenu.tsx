import React from 'react';

import RouteLink from '@/components/Nav/RouteLink';

import { Menu } from './Menu';
import { RouteType } from './types';

const ADMIN_ROUTES: RouteType[] = [
  { label: 'Users', pathname: '/users' },
  {
    label: 'File synchronization',
    pathname: '/fileSync/list',
    pathmatch: '/fileSync/**',
  },
  { label: 'Events', pathname: '/event/list', pathmatch: '/event/**' },
];
const SAMPLES_ROUTES: RouteType[] = [
  { label: 'Wafers', pathname: '/sample/list/wafer' },
  { label: 'Samples', pathname: '/sample/list/sample' },
  { label: 'Dyes', pathname: '/sample/list/dye' },
  { label: 'Devices', pathname: '/sample/list/device' },
];

export function RouteMenu() {
  return (
    <>
      <Menu title="Elements" routes={SAMPLES_ROUTES} />
      <RouteLink
        route={{
          label: 'Measurements',
          pathname: '/measurement/list',
          pathmatch: '/measurement/**',
        }}
      />
      <Menu title="Admin" routes={ADMIN_ROUTES} />
    </>
  );
}