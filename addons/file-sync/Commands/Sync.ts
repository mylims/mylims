// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { v4 as uuid } from '@lukeed/uuid';
import { FileInfo, FileSynchronizer } from 'fs-synchronizer';

import ObjectId from '@ioc:Mongodb/ObjectId';

import File from '../Models/File';
import ImportConfig from '../Models/ImportConfig';

export default class Sync extends BaseCommand {
  public static commandName = 'sync';

  public static description = '';

  @flags.string({
    description: 'Import config to use',
  })
  public importConfigId: string;

  public static settings = {
    loadApp: true,
  };

  public async run() {
    if (!ObjectId.isValid(this.importConfigId)) {
      this.logger.error(`Invalid ObjectId: ${this.importConfigId}`);
      return;
    }

    const importConfig = await ImportConfig.findById(
      new ObjectId(this.importConfigId),
    );
    if (importConfig === null) {
      this.logger.error(`Invalid import config id: ${this.importConfigId}`);
      return;
    }

    const sync = new FileSynchronizer(importConfig);

    const fileHandlers: Promise<void>[] = [];

    sync.on('file', (fileInfo) => {
      fileHandlers.push(this.handleFile(fileInfo));
    });
    sync.on('end', () => {
      this.logger.debug('File lookup ended');
    });

    try {
      await sync.walk();
    } catch (err) {
      this.logger.error(err.message);
    }

    await Promise.all(fileHandlers);

    this.logger.success(`${fileHandlers.length} files synchronized`);
  }

  public async handleFile(fileInfo: FileInfo) {
    this.logger.debug(`Handling file "${fileInfo.filename}"`);

    const { filename } = fileInfo;
    const file = await File.findOne({ filename });
    if (file === null) {
      return this.handleUnknownFile(fileInfo);
    }
    return this.handleKnownFile(fileInfo, file);
  }

  private async handleUnknownFile(fileInfo: FileInfo) {
    this.logger.debug(`Handling unknown file: ${fileInfo.filename}`);

    const { filename, relativePath, stat } = fileInfo;
    await File.create({
      _id: { configId: this.importConfigId, relativePath },
      filename,
      revisions: [
        {
          id: uuid(),
          date: new Date(),
          status: 'PENDING',
          stat,
        },
      ],
    });
    return;
  }

  private async handleKnownFile(
    fileInfo: FileInfo,
    file: InstanceType<typeof File>,
  ) {
    const { modificationDate, size, filename, stat } = fileInfo;
    const lastRevision = file.revisions[0];

    if (
      modificationDate.getTime() === lastRevision.stat.mtime.getTime() &&
      size === lastRevision.stat.size
    ) {
      this.logger.debug('Stats are identical, ignore', undefined, filename);
      return;
    }

    this.logger.debug('Stats have changed, proceed', undefined, filename);

    if (lastRevision.status === 'PENDING') {
      this.logger.debug(
        'Latest revision is still pending, update',
        undefined,
        filename,
      );

      file.revisions[0] = {
        ...lastRevision,
        stat,
      };
      await file.save();
      return;
    }

    this.logger.debug(
      'Latest revision is not pending, create new revision',
      undefined,
      filename,
    );

    file.revisions.unshift({
      id: uuid(),
      date: new Date(),
      status: 'PENDING',
      stat,
    });

    await file.save();
  }
}
