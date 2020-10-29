import Hash from '@ioc:Adonis/Core/Hash';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

export default class LocalAuthProvider implements GenericAuthProvider {
  public async attempt(uid: string, password: string): Promise<string | null> {
    const potentialUser = await User.findOne({ emails: uid });
    if (potentialUser === null) return null;

    const credentialId = potentialUser.authMethods?.local;
    if (credentialId) {
      const credential = await Credential.findById(credentialId);
      if (credential === null) {
        throw new Error(`Invalid credential id: ${credentialId}`);
      }
      if (await Hash.verify(credential.hash, password)) {
        return credentialId;
      }
    }
    return null;
  }
}
