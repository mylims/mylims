/**
 * Contract source: https://git.io/JJOQt
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

declare module '@ioc:Adonis/Core/Drive' {
  interface DisksList {
    local: {
      config: LocalDriverConfig;
    };
    files: {
      config: LocalDriverConfig;
    };
  }
}
