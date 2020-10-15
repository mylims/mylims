import { Model } from '@ioc:Mongodb/Model';

interface AuthMethods {
  ldap?: string;
  local?: string;
}

export default class User extends Model {
  public firstName: string;
  public lastName: string;
  public email: string;
  public role: 'ADMIN' | 'MEMBER';
  public auth: AuthMethods;
}
