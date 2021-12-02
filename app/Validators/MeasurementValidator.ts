import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class MeasurementValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    collection: schema.string(),
    eventId: schema.string(),
    sampleCode: schema.string(),
    sampleKind: schema.string(),
    username: schema.string(),
    file: schema.file.optional(),
    derived: schema.string.optional(),
    description: schema.string.optional(),
  });
}
