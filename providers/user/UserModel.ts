import { Model } from '@ioc:Mongodb/Model';

export function UserBuilder(model: typeof Model) {
  return class User extends model {};
}
