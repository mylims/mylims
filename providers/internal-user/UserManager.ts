import { UserIdentifiers } from '@ioc:Zakodium/User';

import User from 'App/Models/User';

export default class UserManager {
  public async getUser(
    authProvider: string,
    id: string,
    { email, username }: UserIdentifiers = {},
  ) {
    const userByUid = await this.getUserByUID(authProvider, id);
    if (userByUid !== null) return userByUid;

    if (email !== undefined) {
      const userByEmail = await this.getUserByEmail(authProvider, id, email);
      if (userByEmail !== null) return userByEmail;
    }
    if (username !== undefined) {
      const userByUsername = await this.getUserByUsername(
        authProvider,
        id,
        username,
      );
      if (userByUsername !== null) return userByUsername;
    }

    return this.createUser(authProvider, id);
  }

  private getUserByUID(authProvider: string, id: string): Promise<User | null> {
    return User.findBy(`authMethods.${authProvider}`, id);
  }

  private async getUserByEmail(
    authProvider: string,
    id: string,
    email: string,
  ): Promise<User | null> {
    const user = await User.findBy('emails', email);
    if (user === null) {
      return null;
    } else {
      user.authMethods[authProvider] = id;
      await user.save();
    }
    return user;
  }

  private async getUserByUsername(
    authProvider: string,
    id: string,
    username: string,
  ): Promise<User | null> {
    const user = await User.findBy('usernames', username);
    if (user === null) {
      return null;
    } else {
      user.authMethods[authProvider] = id;
      await user.save();
    }
    return user;
  }

  private createUser(authProvider: string, id: string, email?: string) {
    const emails = [];
    if (email) emails.push(email);
    return User.create({
      role: 'MEMBER',
      authMethods: { [authProvider]: id },
      emails,
    });
  }
}
