import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';
import Route from '@ioc:Adonis/Core/Route';

const base = Application.makePath('.');

export function getAddons() {
  return fs.readdirSync(path.join(base, 'addons'));
}

export function registerRoutes() {
  getRoutesFiles().forEach(([addon, addonPath]) => {
    Route.group(() => {
      require(addonPath);
    }).prefix(`/addons/${addon}`);
  });
}

export function getMigrations() {
  return getAddons()
    .filter((addon) =>
      fs.existsSync(path.join(base, 'addons', addon, 'migrations')),
    )
    .map((addon) => path.join('addons', addon, 'migrations'));
}

function getRoutesFiles() {
  return getAddons()
    .map((addon) => [addon, path.join(base, 'addons', addon, 'routes.js')])
    .filter(([, routeFile]) => fs.existsSync(routeFile));
}
