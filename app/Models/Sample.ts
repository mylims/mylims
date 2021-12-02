import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlSampleInput } from 'App/graphql';
import { removeNullable } from 'App/utils';

interface SampleMeasurement {
  id: string;
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
  public userId: string;
  public kind: string;
  public labels: string[];
  public project?: string;
  public meta: Record<string, string | boolean | number | string[]>;
  public title?: string;
  public description?: string;
  public measurements: SampleMeasurement[];
  public attachments: SampleAttachment[];
  public parents: string[];

  public static async fromInput(
    sample: Sample,
    input: GqlSampleInput,
  ): Promise<Sample> {
    const sampleInput = removeNullable(input);
    sample.sampleCode = sampleInput.sampleCode;
    sample.description = sampleInput.description;
    sample.kind = sampleInput.kind;
    sample.labels = sampleInput.labels;
    sample.meta = sampleInput.meta;
    sample.project = sampleInput.project;
    sample.sampleCode = sampleInput.sampleCode;
    sample.title = sampleInput.title;
    sample.userId = sampleInput.userId;
    sample.parents = sampleInput.parent ? [sampleInput.parent] : [];

    await sample.save();
    return sample;
  }
}
