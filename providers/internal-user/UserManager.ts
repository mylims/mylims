import User from 'App/Models/User';

export default class UserManager {
  public async getUser(authProvider: string, id: unknown) {
    const user = await User.findOne({ [`authMethods.${authProvider}`]: id });
    return user || this.createUser(authProvider, id);
  }

  private createUser(authProvider: string, id: unknown) {
    return User.create({ auth: { [authProvider]: id } });
  }
}
