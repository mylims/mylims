import { Stats } from 'fs';

import type { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

interface FileId {
  configId: ObjectId;
  relativePath: string;
}

export interface Revision {
  id: string;
  date: Date;
  status: 'PENDING';
  stat: Stats;
}

export function buildFileModel(ModelClass: typeof Model) {
  return class File extends ModelClass<FileId> {
    public filename: string;
    public revisions: Revision[];
  };
}
