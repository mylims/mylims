import * as cp from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

import { BaseCommand } from '@adonisjs/ace';

import { RcFile } from '@ioc:Adonis/Core/Application';

export default class AddonsLoad extends BaseCommand {
  public static commandName = 'addons:load';
  public static description = 'Load addons and register providers.';

  public async handle() {
    this.logger.info('Loading addons');

    const addons = await fs.readdir('addons');
    this.logger.info(`Found ${addons.length} addons`);

    await this.registerProviders(addons).catch((err) =>
      this.logger.error(`Error while registering addons providers : ${err}`),
    );
    await this.installDependencies(addons).catch(() =>
      this.logger.error('Error while installing addons dependencies.'),
    );
    await this.unexcludeAddonsTs().catch(() =>
      this.logger.error('Failed to unexclude addons folder.'),
    );

    this.logger.success('Successfully loaded addons.');
  }

  private async installDependencies(addons: string[]) {
    await Promise.all(
      addons.map(async (addon) => {
        const addonManifestFile = await fs.readFile(
          path.join('addons', addon, 'package.json'),
          { encoding: 'utf-8' },
        );
        const addonManifest = JSON.parse(addonManifestFile);
        const elnManifestFile = await fs.readFile('package.json', {
          encoding: 'utf-8',
        });
        const elnManifest = JSON.parse(elnManifestFile);

        // dependencies
        const elnDependenciesKeys = Object.keys(elnManifest.dependencies);
        if (addonManifest.dependencies !== undefined) {
          Object.keys(addonManifest.dependencies)
            .filter(
              (dependencyKey) =>
                elnDependenciesKeys.includes(dependencyKey) === false,
            )
            .forEach(
              (dependencyKey) =>
                (elnManifest.dependencies[dependencyKey] =
                  addonManifest.dependencies[dependencyKey]),
            );
        }

        // dev dependencies
        const elnDevDependenciesKeys = Object.keys(elnManifest.devDependencies);
        if (addonManifest.devDependencies !== undefined) {
          Object.keys(addonManifest.devDependencies)
            .filter(
              (devDependencyKey) =>
                elnDevDependenciesKeys.includes(devDependencyKey) === false,
            )
            .forEach(
              (devDependencyKey) =>
                (elnManifest.devDependencies[devDependencyKey] =
                  addonManifest.devDependencies[devDependencyKey]),
            );
        }

        await fs.writeFile(
          'package.json',
          JSON.stringify(elnManifest, null, 2),
        );
        this.logger.info('Merged addons dependencies');
        this.logger.info('Installing dependencies');
        const result = cp.spawnSync(
          `npm${process.platform === 'win32' ? '.cmd' : ''}`,
          ['install'],
          { cwd: '.' },
        );
        if (result.status !== 0) {
          throw new Error('Fail to install dependencies');
        }
      }),
    );
    this.logger.success('Installed addons dependencies');
  }

  private async registerProviders(addons: string[]) {
    const rcFile = await fs.readFile('.adonisrc.json', { encoding: 'utf-8' });
    const rc: RcFile = JSON.parse(rcFile);
    await Promise.all(
      addons.map(async (addon) => {
        (await fs.readdir(path.join('addons', addon, 'providers')))
          .filter((fileName) => path.extname(fileName) === '.ts')
          .map((fileName) =>
            fileName.substr(0, fileName.length - path.extname(fileName).length),
          )
          .forEach((providerName) => {
            const toAdd = `./addons/${addon}/providers/${providerName}`;
            if (rc.providers.includes(toAdd) === false) {
              rc.providers.push(toAdd);
            }
          });
      }),
    );
    await fs.writeFile('.adonisrc.json', JSON.stringify(rc, null, 2));
    this.logger.success('Registered addons providers');
  }

  private async unexcludeAddonsTs() {
    const tsConfig = JSON.parse(
      await fs.readFile('tsconfig.json', { encoding: 'utf-8' }),
    );
    tsConfig.exclude = tsConfig.exclude.filter(
      (excluded) => excluded !== 'addons',
    );
    await fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, 2));
  }
}
