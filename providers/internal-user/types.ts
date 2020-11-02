declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/User';

  export class UserManager {
    public getUser(
      authProvider: string,
      id: string,
      email?: string,
    ): Promise<User>;
    private createUser(authProvider: string, id: string): Promise<User>;
  }
  const UserManagerInstance: InstanceType<typeof UserManager>;
  export default UserManagerInstance;
}
