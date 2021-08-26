import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export class File extends BaseModel {
  public static collectionName = 'processor.files';

  @field()
  public _id: string;
  public filename: string;
  public size: number;
  public originalId: string;
  public eventId: string;
  public topic: string;
}
