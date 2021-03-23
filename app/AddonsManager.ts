import * as fs from 'fs';
import * as path from 'path';

import Application from '@ioc:Adonis/Core/Application';
import { RouterContract } from '@ioc:Adonis/Core/Route';

import { getConfig } from './AppConfig';

const base = Application.makePath('.');
const addonsDirectory = path.join(base, 'addons');

interface AddonManifest {
  displayName: string;
  description: string;
  routes?: string | undefined;
  migrations?: string | undefined;
  schemas?: string | undefined;
  resolvers?: string | undefined;
  commands?: string | undefined;
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
    return path.join('addons', this.getName(), this.manifest.schemas);
  }

  public hasResolversDirectory() {
    return this.manifest.resolvers !== undefined;
  }

  public getResolversDirectory() {
    if (!this.manifest.resolvers) {
      throw new Error(`addon ${this.name} has no resolvers directory`);
    }
    return path.join('addons', this.getName(), this.manifest.resolvers);
  }

  public hasCommandsDirectory() {
    return this.manifest.commands !== undefined;
  }

  public getCommandsDirectory() {
    if (!this.manifest.commands) {
      throw new Error(`addons ${this.name} has no commands directory`);
    }
    return path.join('addons', this.getName(), this.manifest.commands);
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

export function registerRoutes(Route: RouterContract) {
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

export function getResolvers() {
  return getEnabledAddons()
    .filter((addon) => addon.hasResolversDirectory())
    .map((addon) => addon.getResolversDirectory());
}

export function getCommands() {
  return getAddons()
    .filter((addon) => addon.hasCommandsDirectory())
    .map((addons) => addons.getCommandsDirectory());
}
