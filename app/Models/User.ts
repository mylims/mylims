import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

interface AuthMethods {
  [key: string]: string | undefined;
}

export default class User extends BaseModel {
  @field()
  public _id: ObjectId;
  public firstName: string;
  public lastName: string;
  public usernames: string[];
  public emails: string[];
  public role: 'ADMIN' | 'MEMBER';
  public authMethods: AuthMethods;
}
