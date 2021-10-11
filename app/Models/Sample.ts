import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

export enum ActivityType {
  FILE = 'file',
  MEASUREMENT = 'measurement',
}
interface BaseActivity {
  date: Date;
  description?: string;
}
export type Activity = BaseActivity &
  (
    | { type: ActivityType.FILE; fileId: string }
    | { type: ActivityType.MEASUREMENT; measurementId: string }
  );

export class Sample extends BaseModel {
  @field()
  public sampleCode: string[];
  public userId: string;
  public title?: string;
  public description?: string;
  public activities: Activity[];
}
