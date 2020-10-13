import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import UserManager from '@ioc:Zakodium/User';

export default class LdapProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    // IoC container is ready
    this.app.container.with(
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
