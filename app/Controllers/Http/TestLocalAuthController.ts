import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

export default class AppController {
  public async create() {
    const credential = new Credential();
    credential.hash = await Hash.make('root');
    await credential.save();

    const user = new User();
    user.firstName = 'Xavier';
    user.lastName = 'Stouder';
    user.emails = ['xavier@stouder.io', 'xavier.stouder@he-arc.ch'];
    user.role = 'ADMIN';
    user.authMethods = { local: (credential.id as unknown) as string };
    await user.save();
  }
  public async login({ auth }: HttpContextContract) {
    await auth.use('local').login('xavier.stouder@he-arc.ch', 'root');
  }
  public async logout({ auth }: HttpContextContract) {
    auth.logout();
  }
  public async user({ auth, response }: HttpContextContract) {
    await auth.authenticate();
    console.log(auth.user);
    return response.send(auth.user ? 'YES' : 'NO');
  }
}
