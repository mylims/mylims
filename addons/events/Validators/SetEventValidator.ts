import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class NextEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    eventId: schema.string(),
    processorId: schema.string(),
    status: schema.string(),
    message: schema.string.optional(),
  });
}
