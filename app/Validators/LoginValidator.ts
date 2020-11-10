import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';

export default class LoginValidator {
  public constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string(),
    password: schema.string(),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'email.required': 'Missing email',
    'password.required': 'Missing password',
  };
}
