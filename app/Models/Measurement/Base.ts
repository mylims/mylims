import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export interface MeasurementParams {
  eventId: string;
  username: string;
  sampleCode: string[];
  createdBy: string;
  fileId?: string;
  derived?: string;
  description?: string;
}

export class BaseMeasurement extends BaseModel {
  @field()
  public _id: ObjectId;
  public eventId: string;
  public username: string;
  public sampleCode: string[];
  public createdBy: string;
  public fileId?: string;
  public description?: string;
}
