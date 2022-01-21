import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class FileValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    collection: schema.string(),
    file: schema.file(),
  });
}
