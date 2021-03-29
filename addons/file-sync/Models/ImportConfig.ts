import { SyncOptions } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';

export default class ImportConfig extends Model {
  public root: string;
  public enabled: boolean;
  public fileSynchronizerOptions: Omit<SyncOptions, 'root'>;
}
