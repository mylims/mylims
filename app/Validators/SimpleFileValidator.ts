import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class SimpleFileValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({ file: schema.file() });
}
