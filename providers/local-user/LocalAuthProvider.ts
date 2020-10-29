import Hash from '@ioc:Adonis/Core/Hash';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

export default class LocalAuthProvider implements GenericAuthProvider {
  public async attempt(email: string, password: string): Promise<User | null> {
    const credential = await Credential.findOne({ email });
    if (credential === null) return null;

    if (await Hash.verify(credential.hash, password)) {
      return UserManager.getUser('local', credential.id, credential.email);
    } else {
      return null;
    }
  }
}
