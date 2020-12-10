import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import LoginValidator from 'App/Validators/LoginValidator';

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator);
    const result = await auth.use('local').attempt(email, password);
    if (result === false) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }
    return response.ok({ email, role: auth.user?.role });
  }
}
