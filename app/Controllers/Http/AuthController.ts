import { ObjectId } from 'mongodb';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import User from 'App/Models/User';
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

  public async myself({ session, response }: HttpContextContract) {
    const internalUserId = session.get('internal_user');
    const user = await User.findById(new ObjectId(internalUserId));
    if (user === null) {
      return response.ok({
        isAuth: false,
      });
    } else {
      return response.ok({
        isAuth: true,
        email: user.emails[0],
        role: user.role,
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    auth.logout();
    return response.ok({ success: true });
  }
}
