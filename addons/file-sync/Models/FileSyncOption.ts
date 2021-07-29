import { Pattern, SyncOptions } from 'fs-synchronizer';

import { ObjectId, BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export interface ReadyCheck {
  name: string;
  value?: unknown;
}

export interface FileSyncOptionFields extends SyncOptions {
  id: ObjectId;
  root: string;
  enabled: boolean;
  maxDepth: number;
  patterns: Pattern[];
  readyChecks: ReadyCheck[];
}

export class FileSyncOption extends BaseModel {
  public static collectionName = 'fileSync.syncOptions';

  @field()
  public _id: ObjectId;
  public root: string;
  public enabled: boolean;
  public maxDepth: number;
  public patterns: Pattern[];
  public readyChecks: ReadyCheck[];
}
