import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { MeasurementLink } from 'App/Models/Sample';

export default class Notebook extends BaseModel {
  @field()
  public _id: ObjectId;
  public title: string;
  public description?: string;
  public userId: ObjectId;
  public labels: string[];
  public samples: ObjectId[];
  public measurements: MeasurementLink[];
  public project?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public content?: any;
}
