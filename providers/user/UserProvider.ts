import { IocContract } from '@adonisjs/fold';
import { CrendentialBuilder } from 'Providers/local-user-auth/models/CredentialModel';

import { UserManager } from './UserManager';
import { UserBuilder } from './UserModel';

export default class UserProvider {
  public constructor(protected container: IocContract) {}

  public register() {
    this.container.singleton('Zakodium/User', () => {
      const { Model: model } = this.container.use('Mongodb/Model');

      const User = UserBuilder(model);
      const Credential = CrendentialBuilder(model);

      return {
        User,
        Credential,
        UserManager: new UserManager(User),
      };
    });
  }
}
