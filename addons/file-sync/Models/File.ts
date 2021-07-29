import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export class File extends BaseModel {
  public static collectionName = 'fileSync.files';

  @field()
  public _id: string;
  public filename: string;
  public size: number;
}
