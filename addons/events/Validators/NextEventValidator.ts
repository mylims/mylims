import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class NextEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    topic: schema.string(),
    processorId: schema.string(),
  });
}
