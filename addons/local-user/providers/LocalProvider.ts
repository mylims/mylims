import { IocContract } from '@adonisjs/fold';
import { UserManager } from 'providers/user/UserManager';

import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';

import { LocalAuthProvider } from '../LocalAuthProvider';

export default class LocalProvider {
  public constructor(protected container: IocContract) {}

  public boot() {
    // IoC container is ready
    this.container.with(
      ['Adonis/Addons/Auth', 'Zakodium/User', 'Adonis/Core/Hash'],
      (Auth: AuthManagerContract, UserManager: UserManager) => {
        Auth.extend(
          'provider',
          'local',
          (container, config) =>
            new LocalAuthProvider(container, config, UserManager),
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
