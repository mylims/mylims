/**
 * Config source: https://git.io/JJOQe
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { DriveConfig } from '@ioc:Adonis/Core/Drive';

import { getConfig } from 'App/AppConfig';

/*
|--------------------------------------------------------------------------
| Drive configuration
|--------------------------------------------------------------------------
|
| Following is the configuration used by the Drive provider.
|
| Do make sure to pre-define the disks type inside `contracts/drive.ts`
| file for AdonisJs to recognize disks.
|
| Make sure to check `contracts/drive.ts` file for defining extra disks
*/
const driveConfig: DriveConfig = {
  disk: 'local',

  disks: {
    local: {
      driver: 'local',
      visibility: 'private',
      root: getConfig('fileSync').root,
    },
    files: {
      driver: 'local',
      visibility: 'private',
      root: getConfig('filesRoot'),
    },
  },
};

export default driveConfig;
