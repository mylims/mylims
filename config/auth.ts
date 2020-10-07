/**
 * Config source: https://git.io/JvyKy
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

import { config as configFile } from './config.json';

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
  guard: configFile.auth.default as 'ldap' | 'user', // default value
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
        ...configFile.auth.ldap,
      },
    },
  },
};

export default authConfig;
