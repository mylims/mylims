/* eslint-disable camelcase */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import { OidcState } from '@ioc:Zakodium/Oidc';

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
  async ({ response, auth, oidc }: HttpContextContract) => {
    let content: OicdContent, state: OidcState;
    try {
      [content, state] = await oidc.callback<OicdContent>();
    } catch (err) {
      return response.badRequest({ errors: [err.message] });
    }

    await auth.use(`oidc_${state.provider}`).login(content.sub);
    if (!auth.user) {
      return response.internalServerError({ errors: ['Failed to get user'] });
    }

    const { user } = auth;
    if (!user.firstName && content.given_name) {
      user.firstName = content.given_name;
    }
    if (!user.lastName && content.family_name) {
      user.lastName = content.family_name;
    }
    if (!user.emails.includes(content.email)) {
      user.emails.push(content.email);
    }
    await user.save();

    return response.redirect(state.redirectTo);
  },
);
