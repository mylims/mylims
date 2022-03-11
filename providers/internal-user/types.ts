declare module '@ioc:Zakodium/User' {
  import User from 'App/Models/User';

  export interface UserIdentifiers {
    email?: string;
    username?: string;
  }
  export class UserManager {
    public getUser(
      authProvider: string,
      id: string,
      identifiers?: UserIdentifiers,
    ): Promise<User>;
    private createUser(authProvider: string, id: string): Promise<User>;
  }
  const UserManagerInstance: InstanceType<typeof UserManager>;
  export default UserManagerInstance;
}
