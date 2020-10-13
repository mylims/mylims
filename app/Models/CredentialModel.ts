import { Model } from '@ioc:Mongodb/Model';

export default class Credential extends Model {
  public hash: string;
  public resetToken: string | null;
}
