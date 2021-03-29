import { FileInfo } from 'fs-synchronizer';

import { Model } from '@ioc:Mongodb/Model';
import ObjectId from '@ioc:Mongodb/ObjectId';

interface FileId {
  configId: ObjectId;
  relativePath: string;
}

export interface Revision
  extends Pick<FileInfo, 'size' | 'creationDate' | 'modificationDate'> {
  id: string;
  date: Date;
  status: 'PENDING';
}

export default class File extends Model<FileId> {
  public filename: string;
  public revisions: Revision[];
}
