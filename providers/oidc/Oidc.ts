import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { OidcContract, OidcState } from '@ioc:Zakodium/Oidc';

import { verifyOidcJwt } from './utils';

// TODO : config
const authorizationEndpoint =
  'https://login.microsoftonline.com/87839ca1-728a-473a-8c11-95dc39a51c30/oauth2/v2.0/authorize';

const baseLoginUrl = new URL(authorizationEndpoint);
baseLoginUrl.searchParams.set(
  'client_id',
  '6cd84433-e0cd-4135-a3b6-6a2f523a1e7d',
);
baseLoginUrl.searchParams.set('response_type', 'id_token');
baseLoginUrl.searchParams.set(
  'redirect_uri',
  'http://localhost:3333/addons/oidc/callback',
);
baseLoginUrl.searchParams.set('scope', 'openid email profile');
baseLoginUrl.searchParams.set('response_mode', 'form_post');

export default class Oidc implements OidcContract {
  public constructor(private ctx: HttpContextContract) {}

  public login() {
    const { request, response } = this.ctx;
    const query = request.get();
    const redirectTo = query.redirect_to || 'http://localhost:3000';
    const state = {
      redirectTo,
    };

    const loginUrl = new URL(baseLoginUrl.href);
    loginUrl.searchParams.set('nonce', '1111111111');
    loginUrl.searchParams.set('state', JSON.stringify(state));

    return response.redirect(loginUrl.href);
  }

  public async callback<T extends { [key: string]: string }>() {
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
    const token = oidcResponse.id_token;
    const verified = await verifyOidcJwt<T>(token);

    ['oid', 'email', 'preferred_username', 'family_name', 'given_name'].forEach(
      (key) => {
        if (!verified[key]) {
          throw new Error(`missing ${key} claim`);
        }
      },
    );
    return [verified, state] as [T, OidcState];
  }
}
