import Hash from '@ioc:Adonis/Core/Hash';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

export default class LocalAuthProvider implements GenericAuthProvider {
  public async attempt(uid: string, password: string): Promise<User | null> {
    const potentialUser = await User.findOne({ emails: uid });
    if (potentialUser === null) return null;

    const credentialId = potentialUser.authMethods?.local;
    if (credentialId) {
      const credential = await Credential.findById(credentialId);
      if (credential === null) {
        throw new Error(`Invalid credential id: ${credentialId}`);
      }
      if (await Hash.verify(credential.hash, password)) {
        return UserManager.getUser(
          'local',
          credentialId,
          potentialUser.emails[0],
        );
      }
    }
    return null;
  }
}
