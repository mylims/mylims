/**
 * Config source: https://git.io/JvyKy
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

import { getConfig } from '../app/AppConfig';

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
  guard: 'local',
  list: {
    local: {
      driver: 'session',
      provider: {
        driver: 'local',
      },
    },
    // TODO: construct this dynamically
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
