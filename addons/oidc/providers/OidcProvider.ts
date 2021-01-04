import AuthManager from 'providers/zakodium-auth/AuthManager';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { OidcConfig } from '@ioc:Zakodium/Oidc';

export default class OidcProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    this.app.container.with(['Zakodium/Auth'], (AuthManager: AuthManager) => {
      const oidcConfig: OidcConfig = this.app.container
        .use('Adonis/Core/Config')
        .get('oidc', null);
      oidcConfig.providers.forEach((oidcProviderConfig) =>
        AuthManager.extend(
          `oidc_${oidcProviderConfig.identifier}`,
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          new (require('../OidcAuthProvider').default)(oidcProviderConfig),
        ),
      );
    });
  }

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    // App is ready
  }
}
