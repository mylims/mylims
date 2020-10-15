import User from 'App/Models/User';

import { LdapProviderConfig } from '../LdapAuthProvider';

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    ldapUser: {
      implementation: UserProviderContract<User>;
      config: LdapProviderConfig;
    };
  }

  interface GuardsList {
    ldap: {
      implementation: SessionGuardContract<'ldapUser', 'ldap'>;
      config: SessionGuardConfig<'ldapUser'>;
    };
  }
}
