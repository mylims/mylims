declare module '@ioc:Zakodium/Auth' {
  import User from 'App/Models/User';

  export interface AuthContract {
    use(name?: string): AuthContract;
    attempt(uid: string, password: string): Promise<boolean>;
    login(uid: string): Promise<boolean>;
    logout(): void;
    authenticate(): Promise<boolean>;
    user?: User;
    isAuth: boolean;
  }
}
