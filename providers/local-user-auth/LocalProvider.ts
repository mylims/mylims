import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import UserManager from '@ioc:Zakodium/User';

export default class LocalProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    // IoC container is ready
    this.app.container.with(
      ['Adonis/Addons/Auth', 'Zakodium/User'],
      (Auth: AuthManagerContract, UserManager: UserManager) => {
        Auth.extend(
          'provider',
          'local',
          (application) =>
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            new (require('./LocalAuthProvider').default)(
              application,
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
