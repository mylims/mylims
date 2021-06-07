import { createReadStream } from 'fs';
import { promisify } from 'util';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import isMyFileReady, { CheckFunction, editTime, endsWithBytes, endsWithStr, sameSize } from 'is-my-file-ready';

import type DataDrive from '@ioc:DataDrive'
import ObjectId from '@ioc:Mongodb/ObjectId';

import type { File } from '../Models/File';
import type { FileSyncOption, ReadyCheck } from '../Models/FileSyncOption';
import type { SyncFile, SyncState } from '../Models/SyncFile';

const asyncTimeout = promisify(setTimeout);

const readyChecksFunctions = {
  editTime,
  endsWithBytes,
  endsWithStr,
  sameSize
}

export default class Import extends BaseCommand {

  public static commandName = 'file:import'
  public static description = 'Import synchronized files'

  @flags.string({
    description: 'File sync option to use',
  })
  public fileSyncOptionId: string;

  @flags.number({
    description:
      'Interval, import runs one time execution if it is not provided.',
  })
  public interval: number;

  public static settings = {
    loadApp: true,
  }

  private deps: {
    SyncFile: typeof SyncFile,
    FileSyncOption: typeof FileSyncOption,
    SyncState: typeof SyncState,
    DataDrive: typeof DataDrive,
    File: typeof File
  };

  public async run () {
    const { SyncFile, SyncState } = await import('../Models/SyncFile')
    const { FileSyncOption } = await import('../Models/FileSyncOption')
    const { default: DataDrive } = await import('@ioc:DataDrive')
    const { File } = await import('../Models/File')
    this.deps = {
      SyncFile,
      FileSyncOption,
      SyncState,
      DataDrive,
      File
    }

    if(this.interval !== undefined) {
      while(true) {
        await this.executeImporter()
        await this.wait()
      }
    } else {
      await this.executeImporter()
    }
  }

  private async executeImporter() {
    const fileSyncOptionsToProcess: FileSyncOption[] = [];
    if(this.fileSyncOptionId){
      this.logger.debug('file sync option id found')
      if(!ObjectId.isValid(this.fileSyncOptionId)){
        this.logger.error(`invalid ObjectId: ${this.fileSyncOptionId}`)
        return
      }

      const fileSyncOptionId = new ObjectId(this.fileSyncOptionId)
      const fileSyncOption = await this.deps.FileSyncOption.findById(fileSyncOptionId)
      if(fileSyncOption == null){
        this.logger.error(`invalid file sync option id: ${this.fileSyncOptionId}`)
        return;
      }
      fileSyncOptionsToProcess.push(fileSyncOption)
    } else {
      this.logger.debug('no file sync option id found')
      const fileSyncOptions = await (
        await this.deps.FileSyncOption.find({ enabled: true })
      ).all();
      this.logger.debug(`pushing ${fileSyncOptions.length} to process`)
      fileSyncOptionsToProcess.push(...fileSyncOptions)
    }

    for(const fileSyncOptionToProcess of fileSyncOptionsToProcess) {
      await this.handleFileSyncOption(fileSyncOptionToProcess)
    }
  }

  private async handleFileSyncOption(fileSyncOption: FileSyncOption) {
    const fileSyncOptionId = fileSyncOption.id.toHexString()
    this.logger.info('handling file sync option', fileSyncOptionId)
    const syncFiles = await this.deps.SyncFile.find({
      '_id.configId': fileSyncOption.id,
      'revisions.0.status': this.deps.SyncState.PENDING
    })

    const count = await syncFiles.count()
    if(count === 0){
      this.logger.info(`no file to sync`, fileSyncOptionId)
      return
    }

    let importCount = 0;
    for(const syncFile of await syncFiles.all()){
      const isReady = await this.isReady(fileSyncOption.readyChecks, syncFile)
      if(!isReady) {
        this.logger.debug(`still not ready, skipping...`, fileSyncOptionId, syncFile.filename)
        continue;
      }

      syncFile.revisions[0].status = this.deps.SyncState.IMPORTING
      await syncFile.save()

      try {
        await this.importFile(syncFile)
      } catch(err) {
        syncFile.revisions[0].status = this.deps.SyncState.IMPORT_FAIL
        await syncFile.save()
        this.logger.error('failed to import file', fileSyncOptionId, syncFile.filename)
      }

      syncFile.revisions[0].status = this.deps.SyncState.IMPORTED
      await syncFile.save()
      this.logger.debug('imported', fileSyncOptionId, syncFile.filename)
      importCount++;
    }
    this.logger.success(`${importCount} files imported`)
  }

  private async isReady(readyChecks: ReadyCheck[], syncFile: SyncFile): Promise<boolean> {
    const checkResult = await isMyFileReady(syncFile._id.relativePath, readyChecks.map(readyCheck => {
      let value: unknown;
      if(readyCheck.value) {
        value = readyCheck.value
      } else {
        switch(readyCheck.name) {
          case 'editTime':
            value = syncFile.revisions[0].modificationDate
            break;
          case 'sameSize':
            value = syncFile.revisions[0].size
            break;
          default:
            throw new Error('invalid same size')
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toCall: (x: any) => CheckFunction = readyChecksFunctions[readyCheck.name as (keyof typeof readyChecksFunctions)]
      return toCall(value)
    }))

    return checkResult.isReady
  }

  private async importFile(syncFile: SyncFile){
    const drive = this.deps.DataDrive.drive('local')
    const driveFile = await drive.put(syncFile.filename, createReadStream(syncFile._id.relativePath))
    const file = new this.deps.File()
    file.filename = driveFile.filename
    file.size = driveFile.size
    await file.save()
  }

  private async wait() {
    this.logger.info(`waiting ${this.interval}s...`);
    await asyncTimeout(this.interval * 1000);
  }
}
