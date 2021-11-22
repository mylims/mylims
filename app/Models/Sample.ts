import cryptoRandomString from 'crypto-random-string';
import type { InsertOneOptions } from 'mongodb';

import {
  BaseModel,
  field,
  ModelAdapterOptions,
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

  public async create(
    data: Partial<ModelAttributes<Sample>>,
    options?: ModelAdapterOptions<InsertOneOptions>,
  ) {
    let sample: Sample | undefined;
    while (!sample) {
      try {
        const uuid10 = cryptoRandomString({ length: 10, type: 'alphanumeric' });
        sample = await Sample.create({ ...data, uuid10 }, options);
      } catch (e) {
        sample = undefined;
      }
    }
    return sample;
  }
}
