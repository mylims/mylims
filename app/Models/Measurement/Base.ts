import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export interface MeasurementParams {
  username: string;
  sampleCode: string[];
  createdBy?: string;
  fileId?: string;
  eventId?: string;
  derived?: string;
  comment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
}

export class BaseMeasurement extends BaseModel {
  @field()
  public _id: ObjectId;
  public username: string;
  public sampleCode: string[];
  public createdBy?: string;
  public fileId?: string;
  public eventId?: string;
  public comment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public description?: any[];
}
