import { IocContract } from '@adonisjs/fold';
import { UserManager } from 'providers/user/UserManager';

import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';

import { LDAPAuthProvider } from '../LDAPAuthProvider';

export default class LDAPProvider {
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
            new LDAPAuthProvider(container, config, UserManager),
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
