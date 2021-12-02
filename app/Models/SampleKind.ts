import { JSONSchema7 } from 'json-schema';

import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlSampleKindInput } from 'App/graphql';
import { removeNullable } from 'App/utils';

export class SampleKind extends BaseModel {
  @field()
  public _id: string;
  public name?: string;
  public description?: string;
  public color?: string;
  public schema: JSONSchema7;

  public static async fromInput(
    sampleKind: SampleKind,
    input: GqlSampleKindInput,
  ): Promise<SampleKind> {
    const sampleInput = removeNullable(input);
    if (!sampleKind._id) sampleKind._id = sampleInput.id;
    sampleKind.color = sampleInput.color;
    sampleKind.description = sampleInput.description;
    sampleKind.name = sampleInput.name;
    sampleKind.schema = sampleInput.schema;

    await sampleKind.save();
    return sampleKind;
  }
}
