import AuthManager from 'providers/zakodium-auth/AuthManager';

import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class LocalUserProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    this.app.container.with(['Zakodium/Auth'], (AuthManager: AuthManager) => {
      AuthManager.extend(
        'local',
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        new (require('./LocalAuthProvider').default)(),
      );
    });
  }
}
