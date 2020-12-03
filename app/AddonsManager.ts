import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';

import { getConfig } from './AppConfig';

const base = Application.makePath('.');
const addonsDirectory = path.join(base, 'addons');

interface AddonManifest {
  displayName: string;
  description: string;
  routes?: string | undefined;
  migrations?: string | undefined;
  schemas?: string | undefined;
  providers?: string | undefined;
}

export type { Addon };

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

  public getDescription() {
    return this.manifest.description;
  }

  public get isEnabled() {
    return getConfig('enabledAddons').includes(this.name);
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

  public hasSchemasDirectory() {
    return this.manifest.schemas !== undefined;
  }

  public getSchemasDirectory() {
    if (!this.manifest.schemas) {
      throw new Error(`addon ${this.name} has no schemas directory`);
    }
    return path.join(this.addonPath, this.manifest.schemas);
  }

  public hasProvidersDirectory() {
    return this.manifest.providers !== undefined;
  }

  public getProvidersDirectory() {
    if (!this.manifest.providers) {
      throw new Error(`addon ${this.name} has no providers directory`);
    }
    return path.join(this.addonPath, this.manifest.providers);
  }

  public toJSON() {
    return {
      name: this.name,
      displayName: this.manifest.displayName,
      description: this.manifest.description,
    };
  }
}

if (!fs.existsSync(addonsDirectory)) {
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

function getEnabledAddons() {
  return addons.filter((addon) => addon.isEnabled);
}

export async function registerRoutes() {
  const Route = (await import('@ioc:Adonis/Core/Route')).default;

  getEnabledAddons()
    .filter((addon) => addon.hasRoutesFile())
    .forEach((addon) => {
      Route.group(() => {
        require(addon.getRoutesFile());
      }).prefix(`/addons/${addon.getName()}`);
    });
  Route.get('/addons', async () =>
    getEnabledAddons().map((addon) => addon.getName()),
  );
}

export function getMigrations() {
  return getEnabledAddons()
    .filter((addon) => addon.hasMigrationsDirectory())
    .map((addon) => addon.getMigrationsDirectory());
}

export function getSchemas() {
  return getEnabledAddons()
    .filter((addon) => addon.hasSchemasDirectory())
    .map((addon) => addon.getSchemasDirectory());
}

export function getProviders() {
  return getEnabledAddons()
    .filter((addon) => addon.hasProvidersDirectory())
    .map((addon) => addon.getProvidersDirectory());
}
