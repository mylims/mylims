import { Model } from '@ioc:Mongodb/Model';

export class File extends Model<string> {
  public static collectionName = 'fileSync.files';

  public filename: string;
  public size: number;
}
