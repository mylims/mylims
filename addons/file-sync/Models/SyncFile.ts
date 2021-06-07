import { FileInfo } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

interface FileId {
  configId: ObjectId;
  relativePath: string;
}

export interface Revision
  extends Pick<FileInfo, 'size' | 'creationDate' | 'modificationDate'> {
  id: string;
  date: Date;
  status: SyncState;
}

export enum SyncState {
  PENDING = 'pending',
  IMPORTING = 'importing',
  IMPORTED = 'imported',
  IMPORT_FAIL = 'import_fail'
}

export class SyncFile extends Model<FileId> {

  public static collectionName = 'fileSync.syncFiles'

  public filename: string;
  public revisions: Revision[];
}
