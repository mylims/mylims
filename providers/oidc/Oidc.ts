import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import {
  OidcConfig,
  OidcContract,
  OidcProviderConfig,
  OidcState,
} from '@ioc:Zakodium/Oidc';

import { tenCharsIds, verifyOidcJwt } from './utils';

export default class Oidc implements OidcContract {
  private selectedProvider: OidcProviderConfig;

  public constructor(
    private ctx: HttpContextContract,
    private oidcConfig: OidcConfig,
  ) {
    if (oidcConfig === null) throw new Error('Failed to load oidc config');
    this.selectedProvider = this.oidcConfig.providers[0];
  }

  public get availableProviders() {
    return this.oidcConfig.providers.map(({ label, identifier }) => ({
      label,
      identifier,
    }));
  }

  public login(provider: string) {
    this.selectProvider(provider);

    const { request, response } = this.ctx;
    const query = request.get();
    const redirectTo = query.redirect_to || `${Env.get('FRONTEND_URL')}/eln`;
    const state = {
      redirectTo,
      provider,
    };

    const loginUrl = new URL(this.baseLoginUrl.href);
    loginUrl.searchParams.set('nonce', tenCharsIds());
    loginUrl.searchParams.set('state', JSON.stringify(state));

    return response.redirect(loginUrl.href);
  }

  public async callback<T extends { [key: string]: string | undefined }>() {
    const { request } = this.ctx;

    const oidcResponse = request.only([
      'id_token',
      'state',
      'error',
      'error_description',
    ]);

    if (oidcResponse.error) {
      throw new Error(oidcResponse.error_description);
    }

    if (!oidcResponse.id_token || !oidcResponse.state) {
      throw new Error('Bad response from OIDC server');
    }

    const state = JSON.parse(oidcResponse.state) as OidcState;
    this.selectProvider(state.provider);
    const token = oidcResponse.id_token;
    const verified = await verifyOidcJwt<T>(
      token,
      this.selectedProvider.endpoints.keys,
    );

    ['sub', 'email'].forEach((key) => {
      if (!verified[key]) {
        throw new Error(`missing ${key} claim`);
      }
    });

    return [verified, state] as [T, OidcState];
  }

  private selectProvider(providerId: string) {
    const foundProvider = this.oidcConfig.providers.find(
      (provider) => provider.identifier === providerId,
    );
    if (foundProvider === undefined) {
      throw new Error(`Bad provider identifier: ${providerId}`);
    }
    this.selectedProvider = foundProvider;
  }

  private get baseLoginUrl() {
    const baseLoginUrl = new URL(this.selectedProvider.endpoints.authorization);
    baseLoginUrl.searchParams.set('client_id', this.selectedProvider.clientId);
    baseLoginUrl.searchParams.set('response_type', 'id_token');
    baseLoginUrl.searchParams.set(
      'redirect_uri',
      `${Env.get('BACKEND_URL')}/addons/oidc/callback`,
    );
    baseLoginUrl.searchParams.set('scope', 'openid email profile');
    baseLoginUrl.searchParams.set('response_mode', 'form_post');
    return baseLoginUrl;
  }
}
