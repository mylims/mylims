import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';
import Route from '@ioc:Adonis/Core/Route';

const base = Application.makePath('.');
const addonsDirectory = path.join(base, 'addons');

class Addon {
  private routesFile: string | null = null;
  private migrationsDirectory: string | null = null;

  public constructor(private name: string, private addonPath: string) {
    const addonFiles = fs.readdirSync(addonPath);
    for (const addonFile of addonFiles) {
      if (addonFile.startsWith('routes.')) {
        this.routesFile = path.join(this.addonPath, addonFile);
      }
      if (addonFile === 'migrations') {
        this.migrationsDirectory = path.join(this.addonPath, addonFile);
      }
    }
  }

  public getName() {
    return this.name;
  }

  public hasRoutesFile() {
    return this.routesFile !== null;
  }

  public getRoutesFile() {
    if (!this.routesFile) {
      throw new Error(`addon ${this.name} has no routes file`);
    }
    return this.routesFile;
  }

  public hasMigrationsDirectory() {
    return this.migrationsDirectory !== null;
  }

  public getMigrationsDirectory() {
    if (!this.migrationsDirectory) {
      throw new Error(`addon ${this.name} has no migrations directory`);
    }
    return this.migrationsDirectory;
  }
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
