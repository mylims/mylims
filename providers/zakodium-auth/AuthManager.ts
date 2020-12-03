import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';

import Auth from './Auth';

export default class AuthManager {
  public extendedProviders: Map<string, GenericAuthProvider> = new Map();

  public constructor(private application: ApplicationContract) {}

  public getAuthForRequest(ctx: HttpContextContract) {
    return new Auth(this, ctx);
  }

  public extend(name: string, provider: GenericAuthProvider) {
    this.extendedProviders.set(name, provider);
  }
}
