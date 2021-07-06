import { FileInfo } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

import { GqlFileStatus } from 'App/graphql';

interface FileId {
  configId: ObjectId;
  relativePath: string;
}

export interface Revision
  extends Pick<FileInfo, 'size' | 'creationDate' | 'modificationDate'> {
  id: string;
  date: Date;
  status: GqlFileStatus;
}

export const SyncState = GqlFileStatus;

export class SyncFile extends Model<FileId> {
  public static collectionName = 'fileSync.syncFiles';

  public filename: string;
  public revisions: Revision[];
}
