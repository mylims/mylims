import { IocContract } from '@adonisjs/fold';

import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';
import UserManager from '@ioc:Zakodium/User';

export default class LocalProvider {
  public constructor(protected container: IocContract) {}

  public boot() {
    // IoC container is ready
    this.container.with(
      ['Adonis/Addons/Auth', 'Zakodium/User'],
      (Auth: AuthManagerContract, UserManager: UserManager) => {
        Auth.extend(
          'provider',
          'local',
          (container) =>
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            new (require('./LocalAuthProvider').default)(
              container,
              UserManager,
            ),
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
