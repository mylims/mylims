import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export default class Notebook extends BaseModel {
  @field()
  public _id: ObjectId;
  public title: string;
  public description?: string;
  public userId: ObjectId;
  public labels: string[];
  public project?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public content: any[];
}
