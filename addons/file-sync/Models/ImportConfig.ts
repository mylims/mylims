import { Pattern, SyncOptions } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';

interface FileSynchronizerOptions extends Omit<SyncOptions, 'root'> {
  maxDepth: number;
  patterns: Pattern[];
}

export default class ImportConfig extends Model {
  public root: string;
  public enabled: boolean;
  public fileSynchronizerOptions: FileSynchronizerOptions;
}
