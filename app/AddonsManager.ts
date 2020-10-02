import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';

// TODO: not use a class for this
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AddonsManager {
  private static base = Application.makePath('.');

  private constructor() {}

  public static getAddons() {
    return fs.readdirSync(path.join(AddonsManager.base, 'addons'));
  }

  public static registerRoutes() {
    AddonsManager.getRoutesFiles().map(require);
  }

  public static getMigrations() {
    return AddonsManager.getAddons()
      .filter((addon) =>
        fs.existsSync(
          path.join(AddonsManager.base, 'addons', addon, 'migrations'),
        ),
      )
      .map((addon) => path.join('addons', addon, 'migrations'));
  }

  private static getRoutesFiles() {
    return AddonsManager.getAddons()
      .map((addon) =>
        path.join(AddonsManager.base, 'addons', addon, 'routes.js'),
      )
      .filter((routeFile) => fs.existsSync(routeFile));
  }
}
