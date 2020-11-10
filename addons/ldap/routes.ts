import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

Route.post(
  '/login',
  async ({ request, auth, response }: HttpContextContract) => {
    const { uid, password } = request.all();
    const result = await auth.use('ldap').login(uid, password);
    if (result === null || result === false) {
      return response.unauthorized({ error: 'Bad credentials' });
    }
    return response.ok({ email: auth.user?.emails[0], role: auth.user?.role });
  },
);
