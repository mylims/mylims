declare module '@ioc:Adonis/Core/HttpContext' {
  import { OidcContract } from '@ioc:Zakodium/Oidc';

  interface HttpContextContract {
    oidc: OidcContract;
  }
}
