import { IocContract } from '@adonisjs/fold';

import { UserManager } from './UserManager';
import { UserBuilder } from './UserModel';

export default class UserProvider {
  public constructor(protected container: IocContract) {}

  public register() {
    this.container.singleton('Zakodium/User', () => {
      const { Model: model } = this.container.use('Mongodb/Model');
      return new UserManager(UserBuilder(model));
    });
  }

  public boot() {}

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    // App is ready
  }
}
