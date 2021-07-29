import { FileInfo } from 'fs-synchronizer';

import { ObjectId, BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

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

export class SyncFile extends BaseModel {
  public static collectionName = 'fileSync.syncFiles';

  @field()
  public _id: FileId;
  public filename: string;
  public path: string[];
  public revisions: Revision[];
}
