import { Model } from '@ioc:Mongodb/Model';

export function CrendentialsBuilder(model: typeof Model) {
  return class Credentials extends model {
    public hash: string;
  };
}
