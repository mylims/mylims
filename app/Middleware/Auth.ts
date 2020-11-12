import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Auth {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const result = await auth.authenticate();
    if (!result) return response.unauthorized();
    await next();
  }
}
