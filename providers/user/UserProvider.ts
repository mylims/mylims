import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class UserProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Zakodium/User', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const UserManager = require('./UserManager').default;
      return new UserManager();
    });
  }
}
