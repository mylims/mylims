import cryptoRandomString from 'crypto-random-string';

import {
  BaseModel,
  field,
  ModelAttributes,
  ObjectId,
} from '@ioc:Zakodium/Mongodb/Odm';

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
  public uuid10: string;
  public userId: string;
  public title?: string;
  public description?: string;
  public activities: Activity[];
  public measurements: SampleMeasurement[];

  public async create(data: Partial<ModelAttributes<Sample>>) {
    if (data.uuid10) return Sample.create(data);

    const characters = 'CDEHKMPRTUWXY0123456789';
    for (let i = 0; i < 10; i++) {
      const uuid10 = cryptoRandomString({ length: 10, characters });
      const sample = await Sample.findBy('uuid10', uuid10);
      if (!sample) return Sample.create({ ...data, uuid10 });
    }
    throw new Error('Uuid10 was colliding 10 times');
  }
}
