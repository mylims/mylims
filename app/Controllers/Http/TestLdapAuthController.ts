import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import User from 'App/Models/User';

export default class TestLdapAuthController {
  public async create() {
    const user = new User();
    user.firstname = 'Xavier';
    user.lastname = 'Stouder';
    user.role = 'ADMIN';
    user.authMethods = { ldap: 'user01' };
    await user.save();
  }
  public async login({ auth }: HttpContextContract) {
    await auth.use('ldap').attempt('user01', 'password1');
  }
  public async logout({ auth }: HttpContextContract) {
    auth.logout();
  }
  public async user({ auth, response }: HttpContextContract) {
    await auth.authenticate();
    // eslint-disable-next-line no-console
    console.log(auth.user);
    return response.send(auth.user ? 'YES' : 'NO');
  }
}
