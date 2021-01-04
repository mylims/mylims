import Hash from '@ioc:Adonis/Core/Hash';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';
import { ObjectId } from 'mongodb';

export default class LocalAuthProvider implements GenericAuthProvider {
  public login(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  public async attempt(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ emails: email });
    if (user === null) return null;

    const credential = await Credential.findById(
      new ObjectId(user.authMethods.local),
    );
    if (credential === null) return null;

    if (await Hash.verify(credential.hash, password)) {
      return UserManager.getUser(
        'local',
        String(credential.id),
        user.emails[0],
      );
    } else {
      return null;
    }
  }
}
