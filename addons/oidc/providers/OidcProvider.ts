import AuthManager from 'providers/zakodium-auth/AuthManager';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class OidcProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    this.app.container.with(['Zakodium/Auth'], (AuthManager: AuthManager) => {
      AuthManager.extend(
        'oidc',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        new (require('../OidcAuthProvider').default)(),
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
