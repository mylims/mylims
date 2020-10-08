/**
 * Config source: https://git.io/JvyKy
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

import { getConfig } from './config';

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const auth = getConfig('auth');
const authConfig: AuthConfig = {
  guard: auth.default,
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
        driver: 'ldap',
        ...auth.ldap,
      },
    },
  },
};

export default authConfig;
