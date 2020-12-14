import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import { OidcProviderConfig } from '@ioc:Zakodium/Oidc';
import UserManager from '@ioc:Zakodium/User';

import User from 'App/Models/User';

export default class OidcAuthProvider implements GenericAuthProvider {
  public constructor(private oidcProviderConfig: OidcProviderConfig) {}

  public login(uid: string): Promise<User | null> {
    return UserManager.getUser(
      `oidc_${this.oidcProviderConfig.identifier}`,
      uid,
    );
  }

  public async attempt(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
