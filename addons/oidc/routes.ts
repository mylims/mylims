/* eslint-disable camelcase */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import { OidcState } from '@ioc:Zakodium/Oidc';
import UserManager from '@ioc:Zakodium/User';

interface OicdContent {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  [key: string]: string | undefined;
}

Route.get(
  '/providers',
  async ({ oidc }: HttpContextContract) => oidc.availableProviders,
);

Route.get('/login', async ({ request, oidc }: HttpContextContract) => {
  const { oidcProvider } = request.all();
  return oidc.login(oidcProvider);
});

Route.post(
  '/callback',
  async ({ response, auth, oidc, session }: HttpContextContract) => {
    let content: OicdContent, state: OidcState;
    try {
      [content, state] = await oidc.callback<OicdContent>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return response.badRequest({ errors: [err.message] });
    }

    const methodKey = `oidc_${state.provider}`;

    const internalUser = await UserManager.getUser(
      methodKey,
      content.sub,
      content.email,
    );
    if (!internalUser) {
      return response.internalServerError({ errors: ['Failed to get user'] });
    }

    await auth.login(internalUser);
    session.put('mylims.auth.method', methodKey);

    if (!internalUser.firstName && content.given_name) {
      internalUser.firstName = content.given_name;
    }
    if (!internalUser.lastName && content.family_name) {
      internalUser.lastName = content.family_name;
    }
    if (!internalUser.emails.includes(content.email)) {
      internalUser.emails.push(content.email);
    }
    await internalUser.save();

    return response.redirect(state.redirectTo);
  },
);
