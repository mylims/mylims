import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export default class Credential extends BaseModel {
  @field()
  public _id: ObjectId;
  public email: string;
  public hash: string;
}
