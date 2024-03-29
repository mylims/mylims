import { randomUUID } from 'crypto';
import { sep } from 'path';
import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { FileInfo, FileSynchronizer } from 'fs-synchronizer';

import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import type { ConfigProps } from 'App/AppConfig';

import type { FileSyncOption } from '../Models/FileSyncOption';
import type { SyncFile, SyncState } from '../Models/SyncFile';

const asyncTimeout = promisify(setTimeout);

export default class Sync extends BaseCommand {
  public static commandName = 'file:sync';

  public static description = 'Synchronize files';

  @flags.string({ description: 'File sync option to use' })
  public fileSyncOptionId: string;

  public static settings = { loadApp: true };

  private deps: {
    FileSyncOption: typeof FileSyncOption;
    SyncFile: typeof SyncFile;
    SyncState: typeof SyncState;
  };

  public async run() {
    const { FileSyncOption } = await import('../Models/FileSyncOption');
    const { SyncFile, SyncState } = await import('../Models/SyncFile');
    const { getConfig } = await import('App/AppConfig');

    this.deps = {
      FileSyncOption,
      SyncFile,
      SyncState,
    };

    const { interval }: ConfigProps['fileSync'] = getConfig('fileSync');
    if (interval !== undefined) {
      while (true) {
        await this.executeSynchronizer();
        await this.wait(parseInt(interval, 10));
      }
    } else {
      await this.executeSynchronizer();
    }
  }

  private async executeSynchronizer() {
    const fileSyncOptionsToProcess: FileSyncOption[] = [];

    // The fileSyncOptionId was specified in the CLI
    if (this.fileSyncOptionId) {
      this.logger.info(`processing file sync option: ${this.fileSyncOptionId}`);
      if (!ObjectId.isValid(this.fileSyncOptionId)) {
        this.logger.error(`invalid ObjectId: ${this.fileSyncOptionId}`);
        return;
      }

      const fileSyncOption = await this.deps.FileSyncOption.find(
        new ObjectId(this.fileSyncOptionId),
      );
      if (fileSyncOption === null) {
        this.logger.error(
          `invalid file sync option id: ${this.fileSyncOptionId}`,
        );
        return;
      }

      // Confirms to the user if the file sync option is enabled
      if (!fileSyncOption.enabled) {
        this.logger.warning('specified file sync option is disabled');
        const confirmed = await this.prompt.confirm('continue anyway?');
        if (!confirmed) return;
      }

      fileSyncOptionsToProcess.push(fileSyncOption);
    }

    // Searches for the available options to be synchronized
    else {
      const fileSyncOptions = await this.deps.FileSyncOption.query({
        enabled: true,
      }).all();
      fileSyncOptionsToProcess.push(...fileSyncOptions);
    }

    for (const fileSyncOptionToProcess of fileSyncOptionsToProcess) {
      await this.executeConfig(fileSyncOptionToProcess);
    }
  }

  private async executeConfig(fileSyncOption: FileSyncOption) {
    const sync = new FileSynchronizer(fileSyncOption);

    const fileHandlers: Promise<void>[] = [];

    sync.on('file', (fileInfo) => {
      fileHandlers.push(this.handleFile(fileInfo, fileSyncOption));
    });
    sync.on('end', () => {
      this.logger.debug('file lookup ended', this.fileSyncOptionId);
    });

    // Search on the filesystem for each file and checks if it's already in the database
    try {
      await sync.walk();
    } catch (err) {
      this.logger.error(err.message, this.fileSyncOptionId);
    }

    await Promise.all(fileHandlers);

    this.logger.success(`${fileHandlers.length} files synchronized`);
  }

  private async handleFile(fileInfo: FileInfo, fileSyncOption: FileSyncOption) {
    this.logger.debug(
      `handling file "${fileInfo.filename}"`,
      this.fileSyncOptionId,
    );

    const { filename } = fileInfo;
    const file = await this.deps.SyncFile.findBy('filename', filename);
    if (file === null) {
      // Adds a revision to the corresponding file
      return this.handleUnknownFile(fileInfo, fileSyncOption);
    }

    // Creates a new sync file
    return this.handleKnownFile(fileInfo, file);
  }

  private async handleUnknownFile(
    fileInfo: FileInfo,
    fileSyncOption: FileSyncOption,
  ) {
    this.logger.debug(
      `handling unknown file: ${fileInfo.filename}`,
      this.fileSyncOptionId,
    );

    const { filename, relativePath, size, creationDate, modificationDate } =
      fileInfo;

    let path = relativePath.split(sep);
    path.pop();

    const fileId = randomUUID();
    await this.deps.SyncFile.create({
      _id: { configId: fileSyncOption.id, relativePath },
      filename,
      path,
      revisions: [
        {
          id: fileId,
          date: new Date(),
          status: this.deps.SyncState.PENDING,
          size,
          creationDate,
          modificationDate,
        },
      ],
    });
    return;
  }

  private async handleKnownFile(
    fileInfo: FileInfo,
    file: InstanceType<typeof SyncFile>,
  ) {
    const { creationDate, modificationDate, size, filename } = fileInfo;
    const lastRevision = file.revisions[0];

    // Ignores sync files with same modificationDate and size
    if (
      modificationDate.getTime() === lastRevision.modificationDate.getTime() &&
      size === lastRevision.size
    ) {
      this.logger.debug(
        'stats are identical, ignore',
        this.fileSyncOptionId,
        filename,
      );
      return;
    }
    this.logger.debug(
      'stats have changed, proceed',
      this.fileSyncOptionId,
      filename,
    );

    // If the last revision is pending, then update the metadata to the revision
    if (lastRevision.status === this.deps.SyncState.PENDING) {
      this.logger.debug(
        'latest revision is still pending, update',
        this.fileSyncOptionId,
        filename,
      );

      Object.assign(lastRevision, { size, creationDate, modificationDate });
      await file.save();
      return;
    }

    this.logger.debug(
      'latest revision is not pending, create new revision',
      this.fileSyncOptionId,
      filename,
    );

    // Create new revision
    const fileId = randomUUID();
    file.revisions.unshift({
      id: fileId,
      date: new Date(),
      status: this.deps.SyncState.PENDING,
      size,
      creationDate,
      modificationDate,
    });

    await file.save();
  }

  private async wait(interval: number) {
    this.logger.info(`waiting ${interval}s...`);
    await asyncTimeout(interval * 1000);
  }
}
