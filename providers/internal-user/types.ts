declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/User';

  export class UserManager {
    public getUser(
      authProvider: string,
      id: unknown,
      email?: string,
    ): Promise<User>;
    private createUser(authProvider: string, id: unknown): Promise<User>;
  }
  const UserManagerInstance: InstanceType<typeof UserManager>;
  export default UserManagerInstance;
}
