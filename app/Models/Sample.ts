import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { removeNullable } from 'App/Resolvers/utils';
import { GqlSampleInput } from 'App/graphql';

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
    if (sampleInput.sampleCode) sample.sampleCode = sampleInput.sampleCode;
    if (sampleInput.description) sample.description = sampleInput.description;
    if (sampleInput.kind) sample.kind = sampleInput.kind;
    if (sampleInput.labels) sample.labels = sampleInput.labels;
    if (sampleInput.meta) sample.meta = sampleInput.meta;
    if (sampleInput.project) sample.project = sampleInput.project;
    if (sampleInput.sampleCode) sample.sampleCode = sampleInput.sampleCode;
    if (sampleInput.title) sample.title = sampleInput.title;
    if (sampleInput.userId) sample.userId = sampleInput.userId;
    if (sampleInput.parent) sample.parents = [sampleInput.parent];

    await sample.save();
    return sample;
  }
}
