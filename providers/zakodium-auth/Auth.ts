import { ObjectId } from 'mongodb';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AuthContract, GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import User from 'App/Models/User';

import AuthManager from './AuthManager';

export default class Auth implements AuthContract {
  private authProvider: GenericAuthProvider;
  private authProviderName: string;
  private internalUser: User;

  public constructor(
    public authManager: AuthManager,
    public ctx: HttpContextContract,
  ) {}

  /**
   * Set the provider to use.
   * @param name
   */
  public use(name?: string) {
    if (name === undefined) {
      if (this.authProvider === undefined) {
        throw new Error(`No auth provider specified`);
      }
      return this;
    }
    if (!this.authManager.extendedProviders.has(name)) {
      throw new Error(`Missing auth provider: ${name}`);
    }
    this.authProvider = this.authManager.extendedProviders.get(
      name,
    ) as GenericAuthProvider;
    this.authProviderName = name;

    return this;
  }

  /**
   * Login user using the previously defined provider.
   * @param uid
   * @param password
   */
  public async login(uid: string, password: string) {
    const result: string | null = await this.use().authProvider.attempt<string>(
      uid,
      password,
    );
    if (result !== null) {
      this.internalUser = await UserManager.getUser(
        this.authProviderName,
        result,
      );
      this.ctx.session.put('internal_user', this.internalUser.id);
      return true;
    }
    return false;
  }

  /**
   * Logout the user and kill the session
   */
  public async logout() {
    this.ctx.session.forget('internal_user');
  }

  public async authenticate() {
    const userId = this.ctx.session.get('internal_user');
    if (!userId) return false;
    const user = await User.findById(new ObjectId(userId));
    if (user === null) {
      throw new Error('Failed to authenticate: invalid user id');
    }
    this.internalUser = user;
    return true;
  }

  public get user() {
    return this.internalUser;
  }

  public get isAuth() {
    return !!this.ctx.session.get('internal_user');
  }
}
