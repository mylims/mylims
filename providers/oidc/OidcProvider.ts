import { ApplicationContract } from '@ioc:Adonis/Core/Application';

import Oidc from './Oidc';

export default class OidcProvider {
  public static needsApplication = true;
  public constructor(protected app: ApplicationContract) {}

  public boot() {
    // IoC container is ready
  }

  public shutdown() {
    // Cleanup, since app is going down
  }

  public ready() {
    this.app.container.with(['Adonis/Core/HttpContext'], (HttpContext) => {
      const oidcConfig = this.app.container
        .use('Adonis/Core/Config')
        .get('oidc', null);
      HttpContext.getter(
        'oidc',
        function oidc() {
          return new Oidc(this, oidcConfig);
        },
        true,
      );
    });
  }
}
