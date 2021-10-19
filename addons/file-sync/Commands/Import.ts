import { createReadStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import isMyFileReady, {
  CheckFunction,
  editTime,
  endsWithBytes,
  endsWithStr,
  sameSize,
} from 'is-my-file-ready';

import type DataDrive from '@ioc:Zakodium/DataDrive';
import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import type { ConfigProps } from 'App/AppConfig';
import { GqlEventDataType } from 'App/graphql';

import { Event } from '../../events/Models/Event';
import type { File } from '../Models/File';
import type { FileSyncOption, ReadyCheck } from '../Models/FileSyncOption';
import type { SyncFile, SyncState } from '../Models/SyncFile';

const asyncTimeout = promisify(setTimeout);

const readyChecksFunctions = {
  editTime,
  endsWithBytes,
  endsWithStr,
  sameSize,
};

export default class Import extends BaseCommand {
  public static commandName = 'file:import';
  public static description = 'Import synchronized files';

  @flags.string({
    description: 'File sync option to use',
  })
  public fileSyncOptionId: string;

  public static settings = { loadApp: true };

  private deps: {
    SyncFile: typeof SyncFile;
    FileSyncOption: typeof FileSyncOption;
    SyncState: typeof SyncState;
    DataDrive: typeof DataDrive;
    File: typeof File;
    Event: typeof Event;
  };

  public async run() {
    const { SyncFile, SyncState } = await import('../Models/SyncFile');
    const { FileSyncOption } = await import('../Models/FileSyncOption');
    const { default: DataDrive } = await import('@ioc:Zakodium/DataDrive');
    const { File } = await import('../Models/File');
    const { Event } = await import('../../events/Models/Event');
    const { getConfig } = await import('App/AppConfig');

    this.deps = {
      SyncFile,
      FileSyncOption,
      SyncState,
      DataDrive,
      File,
      Event,
    };

    const { interval }: ConfigProps['fileSync'] = getConfig('fileSync');

    if (interval !== undefined) {
      while (true) {
        await this.executeImporter();
        await this.wait(parseInt(interval, 10));
      }
    } else {
      await this.executeImporter();
    }
  }

  private async executeImporter() {
    const fileSyncOptionsToProcess: FileSyncOption[] = [];
    if (this.fileSyncOptionId) {
      this.logger.debug('file sync option id found');
      if (!ObjectId.isValid(this.fileSyncOptionId)) {
        this.logger.error(`invalid ObjectId: ${this.fileSyncOptionId}`);
        return;
      }

      const fileSyncOptionId = new ObjectId(this.fileSyncOptionId);
      const fileSyncOption = await this.deps.FileSyncOption.find(
        fileSyncOptionId,
      );
      if (fileSyncOption == null) {
        this.logger.error(
          `invalid file sync option id: ${this.fileSyncOptionId}`,
        );
        return;
      }
      fileSyncOptionsToProcess.push(fileSyncOption);
    } else {
      this.logger.debug('no file sync option id found');
      const fileSyncOptions = await this.deps.FileSyncOption.query({
        enabled: true,
      }).all();
      this.logger.debug(`pushing ${fileSyncOptions.length} to process`);
      fileSyncOptionsToProcess.push(...fileSyncOptions);
    }

    for (const fileSyncOptionToProcess of fileSyncOptionsToProcess) {
      try {
        await this.handleFileSyncOption(fileSyncOptionToProcess);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  private async handleFileSyncOption(fileSyncOption: FileSyncOption) {
    const fileSyncOptionId = fileSyncOption.id.toHexString();
    const root = fileSyncOption.root;
    this.logger.info('handling file sync option', fileSyncOptionId);
    const syncFiles = this.deps.SyncFile.query({
      '_id.configId': fileSyncOption.id,
      'revisions.0.status': {
        $in: [this.deps.SyncState.PENDING, this.deps.SyncState.IMPORT_FAIL],
      },
    });

    const count = await syncFiles.count();
    if (count === 0) {
      this.logger.info(`no file to sync`, fileSyncOptionId);
      return;
    }
    this.logger.info(`${count} files to sync`);

    let importCount = 0;
    for await (const syncFile of syncFiles) {
      try {
        const isReady = await this.isReady(
          fileSyncOption.readyChecks,
          syncFile,
          root,
        );
        if (!isReady) {
          this.logger.debug(
            `still not ready, skipping...`,
            fileSyncOptionId,
            syncFile.filename,
          );
          continue;
        }

        syncFile.revisions[0].status = this.deps.SyncState.IMPORTING;
        await syncFile.save();

        await this.importFile(syncFile, fileSyncOption);
        syncFile.revisions[0].status = this.deps.SyncState.IMPORTED;
      } catch (err) {
        syncFile.revisions[0].status = this.deps.SyncState.IMPORT_FAIL;
        this.logger.error(
          'failed to import file',
          fileSyncOptionId,
          syncFile.filename,
        );
      }

      await syncFile.save();
      this.logger.debug('imported', fileSyncOptionId, syncFile.filename);
      importCount++;
    }
    this.logger.success(`${importCount} files imported`);
  }

  private async isReady(
    readyChecks: ReadyCheck[],
    syncFile: SyncFile,
    root: string,
  ): Promise<boolean> {
    const checkResult = await isMyFileReady(
      join(root, syncFile._id.relativePath),
      readyChecks.map((readyCheck) => {
        let value: unknown;
        if (readyCheck.value) {
          value = readyCheck.value;
        } else {
          switch (readyCheck.name) {
            case 'editTime':
              value = syncFile.revisions[0].modificationDate;
              break;
            case 'sameSize':
              value = syncFile.revisions[0].size;
              break;
            default:
              throw new Error('invalid ready check name');
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toCall: (x: any) => CheckFunction =
          readyChecksFunctions[
            readyCheck.name as keyof typeof readyChecksFunctions
          ];
        return toCall(value);
      }),
    );

    return checkResult.isReady;
  }

  private async importFile(syncFile: SyncFile, fileSyncOption: FileSyncOption) {
    const drive = this.deps.DataDrive.use('local');
    const filePath = join(fileSyncOption.root, syncFile._id.relativePath);
    const id = syncFile.revisions[0].id;
    const driveFile = await drive.putStream(
      syncFile.filename,
      createReadStream(filePath),
      { id },
    );
    await this.deps.File.create({
      _id: id,
      filename: driveFile.filename,
      size: driveFile.size,
    });

    // Notify the events with topic
    for (const topic of fileSyncOption.topics) {
      try {
        await this.deps.Event.create({
          topic,
          data: { type: GqlEventDataType.FILE, fileId: id },
          processors: [],
        });
      } catch (err) {
        this.logger.error(JSON.stringify(err), `${topic}:${id}`);
      }
    }
    this.logger.debug(
      `created events for topics: ${JSON.stringify(fileSyncOption.topics)}`,
      this.fileSyncOptionId,
      id,
    );
  }

  private async wait(interval: number) {
    this.logger.info(`waiting ${interval}s...`);
    await asyncTimeout(interval * 1000);
  }
}
