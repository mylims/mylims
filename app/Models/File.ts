import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export default class File extends BaseModel {
  @field()
  public _id: string;
  public filename: string;
  public size: number;
  public collection: string;
}
