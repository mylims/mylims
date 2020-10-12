import { UserBuilder } from './UserModel';

export class UserManager {
  public constructor(private User: ReturnType<typeof UserBuilder>) {}

  public async getUser(authProvider: string, id: string) {
    const user = await this.User.findOne({ [`auth.${authProvider}`]: id });
    return user || this.createUser(authProvider, id);
  }

  private createUser(authProvider: string, id: string) {
    return this.User.create({ auth: { [authProvider]: id } });
  }
}
