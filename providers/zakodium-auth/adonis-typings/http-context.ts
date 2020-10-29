declare module '@ioc:Adonis/Core/HttpContext' {
  import { AuthContract } from '@ioc:Zakodium/Auth';

  interface HttpContextContract {
    auth: AuthContract;
  }
}
