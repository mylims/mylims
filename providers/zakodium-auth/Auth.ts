import { ObjectId } from 'mongodb';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AuthContract, GenericAuthProvider } from '@ioc:Zakodium/Auth';

import User from 'App/Models/User';

import AuthManager from './AuthManager';

export default class Auth implements AuthContract {
  private authProvider: GenericAuthProvider;
  private internalUser: User;

  private authProviderName: string;

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
   * Attempt to login user using the previously defined provider.
   * @param uid
   * @param password
   */
  public async attempt(uid: string, password: string) {
    const result: User | null = await this.use().authProvider.attempt(
      uid,
      password,
    );
    if (result !== null) {
      this.internalUser = result;
      this.ctx.session.put('internal_user', String(this.internalUser.id));
      this.ctx.session.commit();
      return true;
    }
    return false;
  }

  /**
   * Login user using the previously defined provider.
   * @param uid
   */
  public async login(uid: string) {
    const result: User | null = await this.use().authProvider.login(uid);
    if (result !== null) {
      this.internalUser = result;
      this.ctx.session.put('internal_user', String(this.internalUser.id));
      this.ctx.session.commit();
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
    const userId: string = this.ctx.session.get('internal_user');
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
