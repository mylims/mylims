import { IocContract } from '@adonisjs/fold';
import * as ldap from 'ldapjs';

import {
  UserProviderContract,
  ProviderUserContract,
} from '@ioc:Adonis/Addons/Auth';
import UserManager from '@ioc:Zakodium/User';

import Credential from 'App/Models/CredentialModel';
import User from 'App/Models/UserModel';

import { LocalUser } from './LocalUser';

/**
 * Database provider to lookup users inside the LDAP
 */
export default class LocalAuthProvider implements UserProviderContract<User> {
  public constructor(
    private container: IocContract<ldap.SearchEntryObject>,
    private UserManager: UserManager,
  ) {}

  /**
   * Returns an instance of provider user
   */
  public getUserFor(user: User) {
    return this.container.make(LocalUser, [user]);
  }

  /**
   * Returns the user row using the primary key
   */
  public async findById(id: string): Promise<ProviderUserContract<User>> {
    const credential = (await Credential.findOne({ email: id })) as Credential;
    const user = await this.UserManager.getUser(
      'local',
      (credential.id as unknown) as string,
    );
    return this.getUserFor(user);
  }

  /**
   * Returns the user row by searching the uidValue against
   * their defined uids.
   */
  public async findByUid(uid: string): Promise<ProviderUserContract<User>> {
    const credential = (await Credential.findOne({ email: uid })) as Credential;
    const user = await this.UserManager.getUser(
      'local',
      (credential.id as unknown) as string,
    );
    return this.getUserFor(user);
  }

  /**
   * Returns a user from their remember me token
   */
  public findByRememberMeToken(/*_userId: string | number, _token: string,*/): Promise<
    ProviderUserContract<User>
  > {
    throw new Error('Method not implemented.');
  }

  /**
   * Updates the user remember me token
   */
  public updateRememberMeToken(/* _authenticatable: ProviderUserContract<MongoUser> */): Promise<
    void
  > {
    throw new Error('Method not implemented.');
  }
}
