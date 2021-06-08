import { parse } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import type { LocalFileSystemStorage } from '@slynova/flydrive';

import type Drive from '@ioc:Adonis/Addons/Drive';
// eslint-disable-next-line import/no-duplicates
import type { DataDrive } from '@ioc:DataDrive';
// eslint-disable-next-line import/no-duplicates
import type DataDriveManager from '@ioc:DataDrive';

import type { File } from '../Models/File';
import type { FileSyncOption } from '../Models/FileSyncOption';
import type { SyncFile, SyncState } from '../Models/SyncFile';

export default class Import extends BaseCommand {
  public static commandName = 'file:integrity';
  public static description = 'Check files integrity';

  public static settings = {
    loadApp: true,
  };

  @flags.boolean({
    description: 'Answer yes to all questions',
    alias: 'y',
  })
  public yes: boolean;

  @flags.boolean({
    description:
      'No action. Perform a simulation of events that would occur but do not actually change anything.',
    alias: 's',
  })
  public simulate: boolean;

  private deps: {
    SyncFile: typeof SyncFile;
    FileSyncOption: typeof FileSyncOption;
    SyncState: typeof SyncState;
    Drive: typeof Drive;
    DataDriveManager: typeof DataDriveManager;
    File: typeof File;
  };

  private drive: LocalFileSystemStorage;
  private dataDrive: DataDrive;

  public async run() {
    const { SyncFile, SyncState } = await import('../Models/SyncFile');
    const { FileSyncOption } = await import('../Models/FileSyncOption');
    const { default: DataDriveManager } = await import('@ioc:DataDrive');
    const { default: Drive } = await import('@ioc:Adonis/Addons/Drive');
    const { File } = await import('../Models/File');

    this.deps = {
      SyncFile,
      FileSyncOption,
      SyncState,
      DataDriveManager,
      Drive,
      File,
    };

    this.drive = this.deps.Drive.disk('local');
    this.dataDrive = this.deps.DataDriveManager.drive('local');

    await this.checkDatabaseIntegrity();
    await this.checkDiskIntegrity();
  }

  private async checkDiskIntegrity() {
    let skippedDeletions = 0;
    for await (const { path } of this.drive.flatList()) {
      const { name } = parse(path);
      this.logger.info('checking', undefined, name);
      if (
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/.exec(
          name,
        )
      ) {
        const result = await this.promptFileForDeletion(
          path,
          name,
          'Filename is not a valid uuid',
        );
        if (!result) {
          skippedDeletions++;
        }
        continue;
      }

      const foundFile = await this.deps.File.findById(name);
      if (foundFile === null) {
        const result = await this.promptFileForDeletion(
          path,
          name,
          'No associated database entry found',
        );
        if (!result) {
          skippedDeletions++;
        }
        continue;
      }
    }
    this.logger.success(
      `disk integrity checked, ${skippedDeletions} integrity violations remaining`,
    );
  }

  private async checkDatabaseIntegrity() {
    const files = await (await this.deps.File.find({})).all();
    let skippedDeletions = 0;
    for (const file of files) {
      this.logger.info('checking', undefined, file.id);
      let size = 0;
      try {
        size = (await this.dataDrive.getStat(file)).size;
      } catch (err) {
        const result = await this.promptDBEntryForDeletion(
          file,
          'File does not exist on disk',
        );
        if (!result) {
          skippedDeletions++;
        }
        continue;
      }

      if (size !== file.size) {
        const result = await this.promptDBEntryForDeletion(
          file,
          'Size in database is not the same as size on disk',
        );
        if (!result) {
          skippedDeletions++;
        }
      }
    }
    this.logger.success(
      `database integrity checked, ${skippedDeletions} integrity violations remaining`,
    );
  }

  private async promptForDeletion(
    deleteCallback: () => Promise<boolean>,
    suffix: string,
    reason: string,
    type: string,
  ) {
    this.logger.info(`${type} integrity violation on "${suffix}"`);
    if (this.simulate) {
      return false;
    }

    const shouldDelete =
      this.yes ||
      (await this.prompt.confirm(`${reason} for "${suffix}", delete ${type}?`));
    if (!shouldDelete) {
      this.logger.info('skip', undefined, suffix);
      return false;
    }
    const wasDeleted = await deleteCallback();
    if (wasDeleted) {
      this.logger.info('deleted', undefined, suffix);
      return true;
    } else {
      this.logger.error('failed to delete', undefined, suffix);
      return false;
    }
  }

  private async promptFileForDeletion(
    path: string,
    name: string,
    reason: string,
  ) {
    const callback = (path: string) => async () => {
      const { wasDeleted } = await this.drive.delete(path);
      return wasDeleted || false;
    };
    return this.promptForDeletion(callback(path), name, reason, 'file');
  }

  private async promptDBEntryForDeletion(file: File, reason: string) {
    const callback = (file: File) => () => {
      return file.delete();
    };
    return this.promptForDeletion(
      callback(file),
      file.id,
      reason,
      'database entry',
    );
  }
}
