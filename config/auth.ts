import { AuthConfig } from '@ioc:Zakodium/Auth';

import { getConfig } from 'App/AppConfig';

const ldapConf = getConfig('ldap');
const authConfig: AuthConfig = {
  defaultProvider: 'local',
  providers: {
    local: {},
    ldap: { ...ldapConf },
  },
};

export default authConfig;
