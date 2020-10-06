import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { BaseCommand } from '@adonisjs/ace';
import Build from '@adonisjs/assembler/build/commands/Build';

import { RcFile } from '@ioc:Adonis/Core/Application';

export default class AddonsPrune extends BaseCommand {
  public static commandName = 'addons:prune';
  public static description = 'Prune addons providers in Adonis manifest file.';

  public async handle() {
    const appRoot = join(this.application.appRoot, '..');
    const rcFilePath = join(appRoot, '.adonisrc.json');
    const rcFile = JSON.parse(
      await readFile(rcFilePath, {
        encoding: 'utf-8',
      }),
    ) as RcFile;
    rcFile.providers = rcFile.providers.filter(
      (provider) => provider.includes('addons') === false,
    );
    await writeFile(rcFilePath, JSON.stringify(rcFile, null, 2));
    this.logger.success('Addons pruned.');
    await this.kernel.runCommand(new Build(this.application, this.kernel), []);
  }
}
