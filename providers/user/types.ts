declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/User';

  export default class UserManager {
    public getUser(authProvider: string, id: string): Promise<User>;
    private createUser(authProvider: string, id: string): Promise<User>;
  }
}
