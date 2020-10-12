declare module '@ioc:Zakodium/User' {
  import { Model } from '@ioc:Mongodb/Model';

  export class Credential extends Model {
    public hash: string;
    public resetToken: string | null;
  }
}
