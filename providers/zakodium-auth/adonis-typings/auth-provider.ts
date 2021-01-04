declare module '@ioc:Zakodium/Auth' {
  import User from 'App/Models/User';

  export interface GenericAuthProvider {
    attempt(uid: string, password: string): Promise<User | null>;
    login(uid: string): Promise<User | null>;
  }
}
