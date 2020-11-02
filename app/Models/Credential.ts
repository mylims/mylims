import { Model } from '@ioc:Mongodb/Model';

export default class Credential extends Model {
  public email: string;
  public hash: string;
}
