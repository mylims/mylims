import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';
import Route from '@ioc:Adonis/Core/Route';

const base = Application.makePath('.');
const addonsDirectory = path.join(base, 'addons');

interface AddonManifest {
  displayName: string;
  description: string;
  routes?: string | undefined;
  migrations?: string | undefined;
}

class Addon {
  private manifest: AddonManifest;

  public constructor(private name: string, private addonPath: string) {
    this.manifest = JSON.parse(
      fs.readFileSync(path.join(addonPath, 'manifest.json'), {
        encoding: 'utf-8',
      }),
    );
  }

  public getDisplayName() {
    return this.manifest.displayName;
  }

  public getName() {
    return this.name;
  }

  public hasRoutesFile() {
    return this.manifest.routes !== undefined;
  }

  public getRoutesFile() {
    if (!this.manifest.routes) {
      throw new Error(`addon ${this.name} has no routes file`);
    }
    return path.join(this.addonPath, this.manifest.routes);
  }

  public hasMigrationsDirectory() {
    return this.manifest.migrations !== undefined;
  }

  public getMigrationsDirectory() {
    if (!this.manifest.migrations) {
      throw new Error(`addon ${this.name} has no migrations directory`);
    }
    return path.join(this.addonPath, this.manifest.migrations);
  }
}

if (fs.existsSync(addonsDirectory) === false) {
  fs.mkdirSync(addonsDirectory);
}

const addons = fs
  .readdirSync(addonsDirectory)
  .map(
    (addonName) => new Addon(addonName, path.join(addonsDirectory, addonName)),
  );

export function getAddons() {
  return addons;
}

export function registerRoutes() {
  addons
    .filter((addon) => addon.hasRoutesFile())
    .forEach((addon) => {
      Route.group(() => {
        require(addon.getRoutesFile());
      }).prefix(`/addons/${addon.getName()}`);
    });
}

export function getMigrations() {
  return addons
    .filter((addon) => addon.hasMigrationsDirectory())
    .map((addon) => addon.getMigrationsDirectory());
}
