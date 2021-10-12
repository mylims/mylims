import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { getConfig } from 'App/AppConfig';

export default class Auth {
  public async handle(
    { auth, response, request }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const token: string | undefined = request.header('Authorization');
    if (token) {
      if (getConfig('serviceToken') !== token) return response.unauthorized();
    } else {
      const result = await auth.authenticate();
      if (!result) return response.unauthorized();
    }
    await next();
  }
}
