/**
 * Config source: https://git.io/JvyKy
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const authConfig: AuthConfig = {
  guard: 'ldap', // default value
  list: {
    user: {
      driver: 'session',
      provider: {
        driver: '',
      },
    },
    ldap: {
      driver: 'session',
      provider: {
        id: '',
        url: 'ldap://127.0.0.1:1389',
        driver: 'ldap',
        appDN: 'cn=admin,dc=example,dc=org',
        appPassword: 'adminpassword',
        baseUserDN: 'ou=users,dc=example,dc=org',
        uid: 'uid',
      },
    },
  },
};

export default authConfig;
