import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';

const base = Application.makePath('.');

export function getAddons() {
  return fs.readdirSync(path.join(base, 'addons'));
}

export function registerRoutes() {
  getRoutesFiles().map(require);
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
    .map((addon) => path.join(base, 'addons', addon, 'routes.js'))
    .filter((routeFile) => fs.existsSync(routeFile));
}
