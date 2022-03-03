import cryptoRandomString from 'crypto-random-string';

import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlSampleInput } from 'App/graphql';
import { removeNullable } from 'App/utils';

interface SampleMeasurement {
  id: ObjectId;
  type: string;
  date: Date;
}

interface SampleAttachment {
  id: string;
  date: Date;
}

export class Sample extends BaseModel {
  @field()
  public _id: ObjectId;
  public sampleCode: string[];
  public uuid10: string;
  public userId: ObjectId;
  public kind: string;
  public labels: string[];
  public project?: string;
  public meta: Record<string, string | boolean | number | string[]>;
  public title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public description?: any[];
  public comment?: string;
  public measurements: SampleMeasurement[];
  public attachments: SampleAttachment[];
  public parents: ObjectId[];

  public static async fromInput(
    sample: Sample,
    input: GqlSampleInput,
  ): Promise<Sample> {
    const sampleInput = removeNullable(input);
    if (!sample.uuid10) {
      sample.uuid10 = cryptoRandomString({ length: 10, type: 'alphanumeric' });
    }
    if (!sample.measurements) sample.measurements = [];
    sample.attachments = sampleInput.attachments.map((id) => ({
      id,
      date: new Date(),
    }));
    sample.sampleCode = sampleInput.sampleCode;
    sample.comment = sampleInput.comment;
    sample.description = sampleInput.description;
    sample.kind = sampleInput.kind;
    sample.labels = sampleInput.labels;
    sample.meta = sampleInput.meta;
    sample.project = sampleInput.project;
    sample.sampleCode = sampleInput.sampleCode;
    sample.title = sampleInput.title;
    sample.userId = new ObjectId(sampleInput.userId);
    sample.parents = sampleInput.parent
      ? [new ObjectId(sampleInput.parent)]
      : [];

    await sample.save();
    return sample;
  }
}
