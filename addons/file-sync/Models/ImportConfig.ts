import { Pattern, SyncOptions } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';

export default class ImportConfig extends Model implements SyncOptions {
  public root: string;
  public maxDepth: number;
  public patterns: Pattern[];
}
