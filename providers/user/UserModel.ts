import { Model } from '@ioc:Mongodb/Model';

interface AuthMethods {
  ldap?: string;
  local?: string;
}

export function UserBuilder(model: typeof Model) {
  return class User extends model {
    public firstName: string;
    public lastName: string;
    public email: string;
    public role: 'ADMIN' | 'MEMBER';
    public auth: AuthMethods;
  };
}
