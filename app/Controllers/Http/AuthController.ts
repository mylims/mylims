import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all();
    const result = await auth.use('local').login(email, password);
    if (result === null || result === false) {
      return response.unauthorized({ email: 'Bad credentials' });
    }
    response.ok({ email, role: auth.user?.role });
  }
}
