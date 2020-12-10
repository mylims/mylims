/* eslint-disable camelcase */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import { OidcState } from '@ioc:Zakodium/Oidc';

interface OicdContent {
  oid: string;
  email: string;
  given_name: string;
  family_name: string;
  [key: string]: string;
}

Route.get('/login', async ({ oidc }: HttpContextContract) => oidc.login());

Route.post(
  '/callback',
  async ({ response, auth, oidc }: HttpContextContract) => {
    let content: OicdContent, state: OidcState;
    try {
      [content, state] = await oidc.callback<OicdContent>();
    } catch (err) {
      return response.badRequest({ errors: [err] });
    }

    await auth.use('oidc').login(content.oid);
    if (!auth.user) {
      return response.internalServerError({ errors: ['Failed to get user'] });
    }

    const { user } = auth;
    if (!user.firstName) user.firstName = content.given_name;
    if (!user.lastName) user.lastName = content.family_name;
    if (!user.emails.includes(content.email)) {
      user.emails.push(content.email);
    }
    await user.save();

    return response.redirect(state.redirectTo);
  },
);
