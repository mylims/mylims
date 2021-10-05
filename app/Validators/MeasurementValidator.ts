import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class MeasurementValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    collection: schema.string(),
    eventId: schema.string(),
    sampleId: schema.string(),
    file: schema.file.optional(),
    filename: schema.string.optional(),
    derived: schema.string.optional(),
    meta: schema.string.optional(),
  });
}
