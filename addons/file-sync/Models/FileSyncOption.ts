import { Pattern } from 'fs-synchronizer';

import { ObjectId, BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export interface ReadyCheck {
  name: string;
  value?: unknown;
}

export class FileSyncOption extends BaseModel {
  public static collectionName = 'fileSync.syncOptions';

  @field()
  public _id: ObjectId;
  public root: string;
  public topics: string[];
  public enabled: boolean;
  public maxDepth: number;
  public patterns: Pattern[];
  public readyChecks: ReadyCheck[];
}
