import { Pattern, SyncOptions } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

export interface ReadyCheck {
  name: string;
  value?: unknown;
}

export interface FileSyncOptionFields extends SyncOptions {
  id?: ObjectId;
  root: string;
  enabled: boolean;
  maxDepth: number;
  patterns: Pattern[];
  readyChecks: ReadyCheck[];
}

export class FileSyncOption extends Model implements FileSyncOptionFields {
  public static collectionName = 'fileSync.syncOptions';

  public root: string;
  public enabled: boolean;
  public maxDepth: number;
  public patterns: Pattern[];
  public readyChecks: ReadyCheck[];
}
