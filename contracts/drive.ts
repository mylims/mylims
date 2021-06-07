/**
 * Contract source: https://git.io/JJOQt
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

declare module '@ioc:Adonis/Addons/Drive' {
  import { LocalFileSystemStorageConfig } from '@slynova/flydrive'

  interface DriveDisksList {
    local: {
      driver: 'local';
      config: LocalFileSystemStorageConfig;
    };
  }
}
