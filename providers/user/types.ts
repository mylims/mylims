declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/User';

  export default class UserManager {
    public getUser(authProvider: string, id: unknown): Promise<User>;
    private createUser(authProvider: string, id: unknown): Promise<User>;
  }
}
