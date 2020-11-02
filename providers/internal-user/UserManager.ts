import User from 'App/Models/User';

export default class UserManager {
  public async getUser(authProvider: string, id: string, email?: string) {
    const userByUid = await this.getUserByUID(authProvider, id);
    if (userByUid !== null) return userByUid;

    if (email !== undefined) {
      const userByEmail = await this.getUserByEmail(authProvider, id, email);
      if (userByEmail !== null) return userByEmail;
    }

    return this.createUser(authProvider, id);
  }

  private getUserByUID(authProvider: string, id: string): Promise<User | null> {
    return User.findOne({ [`authMethods.${authProvider}`]: id });
  }

  private async getUserByEmail(
    authProvider: string,
    id: string,
    email: string,
  ): Promise<User | null> {
    const user = await User.findOne({ emails: email });
    if (user === null) {
      return null;
    } else {
      user.authMethods[authProvider] = id;
      await user.save();
    }
    return user;
  }

  private createUser(authProvider: string, id: string, email?: string) {
    return User.create({
      authMethods: { [authProvider]: id },
      emails: [email],
    });
  }
}
