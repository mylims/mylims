import { Model } from '@ioc:Mongodb/Model';

interface AuthMethods {
  [key: string]: string | undefined;
}

export default class User extends Model {
  public firstName: string;
  public lastName: string;
  public emails: string[];
  public role: 'ADMIN' | 'MEMBER';
  public authMethods: AuthMethods;
}
