import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export interface MeasurementParams {
  eventId: string;
  sampleId: string;
  fileId?: string;
  derived?: string;
  meta?: string;
}

export class BaseMeasurement extends BaseModel {
  @field()
  public eventId: string;
  public sampleId: string;
  public fileId?: string;
  public meta?: Record<string, unknown>;
}
