import { Pattern, SyncOptions } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

export interface FileSyncOptionFields extends SyncOptions {
  id?: ObjectId;
  root: string;
  enabled: boolean;
  maxDepth: number;
  patterns: Pattern[];
}

export default class FileSyncOption
  extends Model
  implements FileSyncOptionFields {
  public root: string;
  public enabled: boolean;
  public maxDepth: number;
  public patterns: Pattern[];
}
