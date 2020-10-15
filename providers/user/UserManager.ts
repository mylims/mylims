import User from 'App/Models/User';

export default class UserManager {
  public async getUser(authProvider: string, id: string) {
    const user = await User.findOne({ [`auth.${authProvider}`]: id });
    return user || this.createUser(authProvider, id);
  }

  private createUser(authProvider: string, id: string) {
    return User.create({ auth: { [authProvider]: id } });
  }
}
