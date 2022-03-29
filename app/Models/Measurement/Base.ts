import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export interface MeasurementParams {
  username: string;
  sampleId: ObjectId;
  title?: string;
  fileId?: string;
  eventId?: ObjectId;
  derived?: string;
  comment?: string;
  createdBy?: ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
}

export class BaseMeasurement extends BaseModel {
  @field()
  public _id: ObjectId;
  public username: string;
  public sampleId: ObjectId;
  public title?: string;
  public fileId?: string;
  public eventId?: ObjectId;
  public comment?: string;
  public createdBy?: ObjectId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public description?: any[];
}
