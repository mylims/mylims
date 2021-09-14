import { randomUUID } from 'crypto';
import { sep } from 'path';
import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { FileInfo, FileSynchronizer } from 'fs-synchronizer';

import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import type { FileSyncOption } from '../Models/FileSyncOption';
import type { SyncFile, SyncState } from '../Models/SyncFile';

const asyncTimeout = promisify(setTimeout);

export default class Sync extends BaseCommand {
  public static commandName = 'file:sync';

  public static description = 'Synchronize files';

  @flags.string({ description: 'File sync option to use' })
  public fileSyncOptionId: string;

  @flags.number({
    description:
      'Interval, sync runs one time execution if it is not provided.',
  })
  public interval: number;

  public static settings = {
    loadApp: true,
  };

  private deps: {
    FileSyncOption: typeof FileSyncOption;
    SyncFile: typeof SyncFile;
    SyncState: typeof SyncState;
  };

  public async run() {
    const { FileSyncOption } = await import('../Models/FileSyncOption');
    const { SyncFile, SyncState } = await import('../Models/SyncFile');

    this.deps = {
      FileSyncOption,
      SyncFile,
      SyncState,
    };

    if (this.interval !== undefined) {
      while (true) {
        await this.executeSynchronizer();
        await this.wait();
      }
    } else {
      await this.executeSynchronizer();
    }
  }

  private async executeSynchronizer() {
    const fileSyncOptionsToProcess: FileSyncOption[] = [];

    if (this.fileSyncOptionId) {
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
      if (!fileSyncOption.enabled) {
        this.logger.warning('specified file sync option is disabled');
        const confirmed = await this.prompt.confirm('continue anyway?');
        if (!confirmed) return;
      }

      fileSyncOptionsToProcess.push(fileSyncOption);
    } else {
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
      return this.handleUnknownFile(fileInfo, fileSyncOption);
    }
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

  private async wait() {
    this.logger.info(`waiting ${this.interval}s...`);
    await asyncTimeout(this.interval * 1000);
  }
}
