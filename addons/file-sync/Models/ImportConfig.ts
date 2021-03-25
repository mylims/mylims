import { Pattern, SyncOptions } from 'fs-synchronizer';

import type { Model } from '@ioc:Mongodb/Model';

export function buildImportConfigModel(ModelClass: typeof Model) {
  return class ImportConfig extends ModelClass implements SyncOptions {
    public root: string;
    public maxDepth: number;
    public patterns: Pattern[];
  };
}
