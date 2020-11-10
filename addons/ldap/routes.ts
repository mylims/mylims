import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import LoginValidator from './Validators/LoginValidator';

Route.post(
  '/login',
  async ({ request, auth, response }: HttpContextContract) => {
    const { uid, password } = await request.validate(LoginValidator);
    const result = await auth.use('ldap').login(uid, password);
    if (result === null || result === false) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }
    return response.ok({ email: auth.user?.emails[0], role: auth.user?.role });
  },
);
