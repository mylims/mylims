import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import LoginValidator from 'App/Validators/LoginValidator';

Route.post(
  '/login',
  async ({ request, auth, response }: HttpContextContract) => {
    const { email, password } = await request.validate(LoginValidator);
    const result = await auth.use('ldap').login(email, password);
    if (result === null || result === false) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }
    return response.ok({ email: auth.user?.emails[0], role: auth.user?.role });
  },
);
