import { ObjectId } from 'mongodb';

import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';
import LoginValidator from 'App/Validators/LoginValidator';

export default class AuthController {
  public async login({
    request,
    auth,
    response,
    session,
  }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator);
    const credential = await Credential.findOne({ email });
    if (
      credential === null ||
      !(await Hash.verify(credential.hash, password))
    ) {
      return response.unauthorized({
        errors: [{ message: 'Bad credentials' }],
      });
    }

    const user = await User.findOne({ emails: email });
    if (user === null) {
      return response.notFound({ errors: [{ message: 'User not found' }] });
    }

    await auth.login(user);
    session.put('mylims.auth.method', 'local');
    return response.ok({ email, role: auth.user?.role });
  }

  public async myself({ response, auth }: HttpContextContract) {
    const { user } = auth;
    if (user) {
      return response.ok({
        isAuth: true,
        email: user.emails[0],
        role: user.role,
      });
    } else {
      return response.ok({
        isAuth: false,
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();
    return response.ok({ success: true });
  }
}
