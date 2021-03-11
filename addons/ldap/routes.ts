import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import { attempt } from './LdapAuthProvider';
import LoginValidator from './Validators/LoginValidator';

Route.post(
  '/login',
  async ({ request, auth, response, session }: HttpContextContract) => {
    const { uid, password } = await request.validate(LoginValidator);

    const result = await attempt(uid, password);
    if (result === null) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }

    await auth.login(result);
    session.put('mylims.auth.method', 'ldap');

    return response.ok({ email: auth.user?.emails[0], role: auth.user?.role });
  },
);
