import { UserBuilder } from './UserModel';

export class UserManager {
  public constructor(private User: ReturnType<typeof UserBuilder>) {}

  public async getUser(authProvider: string, id: string) {
    console.log('getUser');
    const user = await this.User.findOne({ [`${authProvider}_auth`]: id });
    if (user === null) {
      return this.createUser(authProvider, id);
    }
    return user;
  }

  private createUser(authProvider: string, id: string) {
    console.log('createUser');
    return this.User.create({ [`${authProvider}_auth`]: id });
  }
}
