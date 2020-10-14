import User from 'App/Models/UserModel';

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    localUser: {
      implementation: UserProviderContract<User>;
      config: unknown;
    };
  }

  interface GuardsList {
    local: {
      implementation: SessionGuardContract<'localUser', 'local'>;
      config: SessionGuardConfig<'localUser'>;
    };
  }
}
