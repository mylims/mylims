import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export enum ActivityType {
  FILE = 'file',
  MEASUREMENT = 'measurement',
}

interface BaseActivity {
  date: Date;
  description?: string;
}
interface SampleMeasurement {
  id: string;
  type: string;
}

export type Activity = BaseActivity &
  (
    | { type: ActivityType.FILE; fileId: string }
    | {
        type: ActivityType.MEASUREMENT;
        measurementId: string;
        measurementType: string;
      }
  );

export class Sample extends BaseModel {
  @field()
  public _id: ObjectId;
  public sampleCode: string[];
  public userId: string;
  public title?: string;
  public description?: string;
  public activities: Activity[];
  public measurements: SampleMeasurement[];
}
