declare module '@ioc:Zakodium/User' {
  import { Model } from '@ioc:Mongodb/Model';

  interface AuthMethods {
    ldap?: string;
    local?: string;
  }

  export class User extends Model {
    public firstName: string;
    public lastName: string;
    public email: string;
    public role: 'ADMIN' | 'MEMBER';
    public auth: AuthMethods;
  }

  export class Credential extends Model {
    public hash: string;
    public resetToken: string | null;
  }
}
