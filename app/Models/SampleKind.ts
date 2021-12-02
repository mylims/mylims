import { JSONSchema7 } from 'json-schema';

import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

import { removeNullable } from 'App/Resolvers/utils';
import { GqlSampleKindInput } from 'App/graphql';

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
    if (sampleInput.color) sampleKind.color = sampleInput.color;
    if (sampleInput.description) {
      sampleKind.description = sampleInput.description;
    }
    if (sampleInput.name) sampleKind.name = sampleInput.name;
    if (sampleInput.schema) sampleKind.schema = sampleInput.schema;
    await sampleKind.save();
    return sampleKind;
  }
}
