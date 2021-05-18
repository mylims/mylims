import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { v4 as uuid } from '@lukeed/uuid';
import { FileInfo, FileSynchronizer } from 'fs-synchronizer';

import ObjectId from '@ioc:Mongodb/ObjectId';

import File from '../Models/File';
import FileSyncOption from '../Models/FileSyncOption';

const asyncTimeout = promisify(setTimeout);

export default class Sync extends BaseCommand {
  public static commandName = 'sync';

  public static description = '';

  @flags.string({
    description: 'File sync option to use',
  })
  public fileSyncOptionId: string;

  @flags.number({
    description:
      'Interval, sync runs one time execution if it is not provided.',
  })
  public interval: number;

  public static settings = {
    loadApp: true,
  };

  public async run() {
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

      const fileSyncOption = await FileSyncOption.findById(
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
      }

      fileSyncOptionsToProcess.push(fileSyncOption);
    } else {
      const fileSyncOptions = await (
        await FileSyncOption.find({ enabled: true })
      ).all();
      fileSyncOptionsToProcess.push(...fileSyncOptions);
    }

    for (const fileSyncOptionToProcess of fileSyncOptionsToProcess) {
      await this.executeConfig(fileSyncOptionToProcess);
    }
  }

  private async executeConfig(fileSyncOption: FileSyncOption) {
    const sync = new FileSynchronizer({
      ...fileSyncOption,
    });

    const fileHandlers: Promise<void>[] = [];
    const fileSyncOptionId = fileSyncOption.id.toHexString();

    sync.on('file', (fileInfo) => {
      fileHandlers.push(this.handleFile(fileInfo, fileSyncOptionId));
    });
    sync.on('end', () => {
      this.logger.debug('file lookup ended', fileSyncOptionId);
    });

    try {
      await sync.walk();
    } catch (err) {
      this.logger.error(err.message, fileSyncOptionId);
    }

    await Promise.all(fileHandlers);

    this.logger.success(`${fileHandlers.length} files synchronized`);
  }

  private async handleFile(fileInfo: FileInfo, fileSyncOptionId: string) {
    this.logger.debug(`handling file "${fileInfo.filename}"`, fileSyncOptionId);

    const { filename } = fileInfo;
    const file = await File.findOne({ filename });
    if (file === null) {
      return this.handleUnknownFile(fileInfo, fileSyncOptionId);
    }
    return this.handleKnownFile(fileInfo, file, fileSyncOptionId);
  }

  private async handleUnknownFile(
    fileInfo: FileInfo,
    fileSyncOptionId: string,
  ) {
    this.logger.debug(
      `handling unknown file: ${fileInfo.filename}`,
      fileSyncOptionId,
    );

    const {
      filename,
      relativePath,
      size,
      creationDate,
      modificationDate,
    } = fileInfo;
    await File.create({
      _id: { configId: this.fileSyncOptionId, relativePath },
      filename,
      revisions: [
        {
          id: uuid(),
          date: new Date(),
          status: 'PENDING',
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
    file: InstanceType<typeof File>,
    fileSyncOptionId: string,
  ) {
    const { creationDate, modificationDate, size, filename } = fileInfo;
    const lastRevision = file.revisions[0];

    if (
      modificationDate.getTime() === lastRevision.modificationDate.getTime() &&
      size === lastRevision.modificationDate.getTime()
    ) {
      this.logger.debug(
        'stats are identical, ignore',
        fileSyncOptionId,
        filename,
      );
      return;
    }

    this.logger.debug(
      'stats have changed, proceed',
      fileSyncOptionId,
      filename,
    );

    if (lastRevision.status === 'PENDING') {
      this.logger.debug(
        'latest revision is still pending, update',
        fileSyncOptionId,
        filename,
      );

      Object.assign(lastRevision, { size, creationDate, modificationDate });
      await file.save();
      return;
    }

    this.logger.debug(
      'latest revision is not pending, create new revision',
      fileSyncOptionId,
      filename,
    );

    file.revisions.unshift({
      id: uuid(),
      date: new Date(),
      status: 'PENDING',
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
