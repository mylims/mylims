declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/UserModel';

  export default class UserManager {
    public getUser(authProvider: string, id: string): Promise<User>;
    private createUser(authProvider: string, id: string): Promise<User>;
  }
}
