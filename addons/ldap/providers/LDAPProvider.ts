import { IocContract } from '@adonisjs/fold';
import UserManager from 'providers/user/UserManager';

import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';

export default class LdapProvider {
  public constructor(protected container: IocContract) {}

  public boot() {
    // IoC container is ready
    this.container.with(
      ['Adonis/Addons/Auth', 'Zakodium/User'],
      (Auth: AuthManagerContract, UserManager: UserManager) => {
        Auth.extend(
          'provider',
          'ldap',
          (container, config) =>
            new (require('./LDAPAuthProvider'))(container, config, UserManager),
        );
      },
    );
  }

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    // App is ready
  }
}
