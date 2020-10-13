import { IocContract } from '@adonisjs/fold';

export default class UserProvider {
  public constructor(protected container: IocContract) {}

  public register() {
    this.container.singleton('Zakodium/User', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const UserManager = require('./UserManager').default;
      return new UserManager();
    });
  }
}
