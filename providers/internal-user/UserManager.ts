import User from 'App/Models/User';

export default class UserManager {
  public async getUser(authProvider: string, id: unknown, email?: string) {
    const userByUid = await this.getUserByUID(authProvider, id);
    if (userByUid !== null) return userByUid;

    if (email !== undefined) {
      const userByEmail = await this.getUserByEmail(email);
      if (userByEmail !== null) return userByEmail;
    }

    return this.createUser(authProvider, id);
  }

  private getUserByUID(
    authProvider: string,
    id: unknown,
  ): Promise<User | null> {
    return User.findOne({ [`authMethods.${authProvider}`]: id });
  }

  private getUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ emails: email });
  }

  private createUser(authProvider: string, id: unknown) {
    return User.create({ auth: { [authProvider]: id } });
  }
}
