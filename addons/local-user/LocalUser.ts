import { inject } from '@adonisjs/fold';
import { UserBuilder } from 'providers/user/UserModel';

import { ProviderUserContract } from '@ioc:Adonis/Addons/Auth';
import { HashContract } from '@ioc:Adonis/Core/Hash';

import { CrendentialsBuilder } from './models/CredentialsModel';

export type MongoUser = InstanceType<ReturnType<typeof UserBuilder>>;

/**
 * LDAP user works a bridge between the provider and the guard
 */
@inject([null, null, 'Adonis/Core/Hash', 'Mongodb/Model'])
export class LocalUser implements ProviderUserContract<MongoUser> {
  public constructor(
    public user: MongoUser,
    private Hash: HashContract,
    private Model: any,
  ) {
    this.user = user;
  }

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
    const credential = await CrendentialsBuilder(this.Model).findById(local);
    if (credential === null) throw new Error('credential not found');
    return this.Hash.verify(credential.hash, _plainPassword);
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
