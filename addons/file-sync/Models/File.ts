import { Stats } from 'fs';

import { Model } from '@ioc:Mongodb/Model';
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

export default class File extends Model<FileId> {
  public filename: string;
  public revisions: Revision[];
}
