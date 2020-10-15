import { ProviderUserContract } from '@ioc:Adonis/Addons/Auth';
import Hash from '@ioc:Adonis/Core/Hash';

import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

/**
 * Local user works a bridge between the provider and the guard
 */
export class LocalUser implements ProviderUserContract<User> {
  public constructor(public user: User) {}

  /**
   * Returns the value of the user id
   */
  public getId(): string | null {
    const { local } = this.user.auth;
    return local || null;
  }

  /**
   * Verifies the user password
   */
  public async verifyPassword(_plainPassword: string) {
    const { local } = this.user.auth;
    if (!local) {
      return Promise.reject(new Error("user doesn't have local auth"));
    }
    const credential = await Credential.findById(local);
    if (credential === null) throw new Error('credential not found');
    return Hash.verify(credential.hash, _plainPassword);
  }

  /**
   * Returns the user remember me token or null
   */
  public getRememberMeToken(): string | null {
    return null;
  }

  /**
   * Updates user remember me token
   */
  public setRememberMeToken(/* _token: string */): void {
    throw new Error('Method not implemented.');
  }
}
