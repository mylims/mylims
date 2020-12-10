import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import User from 'App/Models/User';

import authConfig from '../../config/auth';

export interface OidcProviderConfig {
  hello: string;
}

export default class OidcAuthProvider implements GenericAuthProvider {
  private config: OidcProviderConfig;

  public constructor() {
    this.config = authConfig.providers.oidc as OidcProviderConfig;
  }

  public login(uid: string): Promise<User | null> {
    return UserManager.getUser('oidc', uid);
  }

  public async attempt(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
