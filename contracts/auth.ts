import {
  MongodbModelAuthProviderContract,
  MongodbModelAuthProviderConfig,
} from '@ioc:Zakodium/Mongodb/Odm';

import User from 'App/Models/User';

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: MongodbModelAuthProviderContract<typeof User>;
      config: MongodbModelAuthProviderConfig<typeof User>;
    };
  }

  interface GuardsList {
    web: {
      implementation: SessionGuardContract<'user', 'web'>;
      config: SessionGuardConfig<'user'>;
    };
  }
}
