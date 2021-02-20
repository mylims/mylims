import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class ZakodiumAuthProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    // IoC container is ready
    this.app.container.singleton('Zakodium/Auth', () => {
      const authConfig = this.app.container
        .use('Adonis/Core/Config')
        .get('auth', {});
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AuthManager = require('./AuthManager').default;
      return new AuthManager(this.app, authConfig);
    });
  }

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    this.app.container.withBindings(
      ['Adonis/Core/HttpContext', 'Zakodium/Auth'],
      (HttpContext, AuthManager) => {
        HttpContext.getter(
          'auth',
          function auth() {
            return AuthManager.getAuthForRequest(this);
          },
          true,
        );
      },
    );
  }
}
