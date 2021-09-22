import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class CreateFileValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file(),
    filename: schema.string(),
    eventId: schema.string(),
    sampleId: schema.string(),
  });
}
