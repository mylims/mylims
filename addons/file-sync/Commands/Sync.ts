import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { v4 as uuid } from '@lukeed/uuid';
import { FileInfo, FileSynchronizer } from 'fs-synchronizer';

import ObjectId from '@ioc:Mongodb/ObjectId';

import File from '../Models/File';
import ImportConfig from '../Models/ImportConfig';

const asyncTimeout = promisify(setTimeout);

export default class Sync extends BaseCommand {
  public static commandName = 'sync';

  public static description = '';

  @flags.string({
    description: 'Import config to use',
  })
  public importConfigId: string;

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
    const importConfigsToProcess: ImportConfig[] = [];

    if (this.importConfigId) {
      if (!ObjectId.isValid(this.importConfigId)) {
        this.logger.error(`invalid ObjectId: ${this.importConfigId}`);
        return;
      }

      const importConfig = await ImportConfig.findById(
        new ObjectId(this.importConfigId),
      );
      if (importConfig === null) {
        this.logger.error(`invalid import config id: ${this.importConfigId}`);
        return;
      }
      if (!importConfig.enabled) {
        this.logger.warning('specified import is disabled');
      }

      importConfigsToProcess.push(importConfig);
    } else {
      const importConfigs = await (
        await ImportConfig.find({ enabled: true })
      ).all();
      importConfigsToProcess.push(...importConfigs);
    }

    for (const importConfigToProcess of importConfigsToProcess) {
      await this.executeConfig(importConfigToProcess);
    }
  }

  private async executeConfig(importConfig: ImportConfig) {
    const sync = new FileSynchronizer({
      root: importConfig.root,
      ...importConfig.fileSynchronizerOptions,
    });

    const fileHandlers: Promise<void>[] = [];
    const importConfigId = importConfig.id.toHexString();

    sync.on('file', (fileInfo) => {
      fileHandlers.push(this.handleFile(fileInfo, importConfigId));
    });
    sync.on('end', () => {
      this.logger.debug('file lookup ended', importConfigId);
    });

    try {
      await sync.walk();
    } catch (err) {
      this.logger.error(err.message, importConfigId);
    }

    await Promise.all(fileHandlers);

    this.logger.success(`${fileHandlers.length} files synchronized`);
  }

  private async handleFile(fileInfo: FileInfo, importConfigId: string) {
    this.logger.debug(`handling file "${fileInfo.filename}"`, importConfigId);

    const { filename } = fileInfo;
    const file = await File.findOne({ filename });
    if (file === null) {
      return this.handleUnknownFile(fileInfo, importConfigId);
    }
    return this.handleKnownFile(fileInfo, file, importConfigId);
  }

  private async handleUnknownFile(fileInfo: FileInfo, importConfigId: string) {
    this.logger.debug(
      `handling unknown file: ${fileInfo.filename}`,
      importConfigId,
    );

    const {
      filename,
      relativePath,
      size,
      creationDate,
      modificationDate,
    } = fileInfo;
    await File.create({
      _id: { configId: this.importConfigId, relativePath },
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
    importConfigId: string,
  ) {
    const { creationDate, modificationDate, size, filename } = fileInfo;
    const lastRevision = file.revisions[0];

    if (
      modificationDate.getTime() === lastRevision.modificationDate.getTime() &&
      size === lastRevision.modificationDate.getTime()
    ) {
      this.logger.debug(
        'stats are identical, ignore',
        importConfigId,
        filename,
      );
      return;
    }

    this.logger.debug('stats have changed, proceed', importConfigId, filename);

    if (lastRevision.status === 'PENDING') {
      this.logger.debug(
        'latest revision is still pending, update',
        importConfigId,
        filename,
      );

      Object.assign(lastRevision, { size, creationDate, modificationDate });
      await file.save();
      return;
    }

    this.logger.debug(
      'latest revision is not pending, create new revision',
      importConfigId,
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
