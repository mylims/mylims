import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export interface MeasurementParams {
  username: string;
  sampleId: ObjectId;
  createdBy?: ObjectId;
  fileId?: string;
  eventId?: ObjectId;
  derived?: string;
  comment?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
}

export class BaseMeasurement extends BaseModel {
  @field()
  public _id: ObjectId;
  public username: string;
  public sampleId: ObjectId;
  public createdBy?: ObjectId;
  public fileId?: string;
  public eventId?: ObjectId;
  public comment?: string;
  public title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public description?: any[];
}
