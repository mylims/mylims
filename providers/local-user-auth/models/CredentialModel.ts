import { Model } from '@ioc:Mongodb/Model';

export function CrendentialBuilder(model: typeof Model) {
  return class Credential extends model {
    public hash: string;
    public resetToken: string | null;
  };
}
