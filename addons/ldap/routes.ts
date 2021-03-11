import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import LdapAuthProvider from './LdapAuthProvider';
import LoginValidator from './Validators/LoginValidator';

Route.post(
  '/login',
  async ({ request, auth, response }: HttpContextContract) => {
    const { uid, password } = await request.validate(LoginValidator);

    const ldapProvider = new LdapAuthProvider();

    const result = await ldapProvider.attempt(uid, password);
    if (result === null) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }

    auth.login(result);

    return response.ok({ email: auth.user?.emails[0], role: auth.user?.role });
  },
);
