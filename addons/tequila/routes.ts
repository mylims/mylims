import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import UserManager from '@ioc:Zakodium/User';

import { getConfig } from 'App/AppConfig';

export interface TequilaProviderConfig {
  hostUrl: string;
  groupName?: string;
}

const config: TequilaProviderConfig = getConfig('tequila');
const userFields = ['name', 'firstname', 'email', 'uniqueid'] as const;
type TequilaUser = {
  [k in typeof userFields[number]]: string;
};
const requestBody: Record<string, string | undefined> = {
  urlaccess: `${Env.get('BACKEND_URL')}/tequila/validate`,
  request: userFields.join(','),
  require: config.groupName && `group=${config.groupName}`,
};

Route.get('/login', async ({ response }: HttpContextContract) => {
  try {
    // append query params
    const url = new URL(`${config.hostUrl}/createrequest`);
    for (const key in requestBody) {
      if (requestBody[key] !== undefined) {
        url.searchParams.append(key, requestBody[key] as string);
      }
    }
    const requestAns = await fetch(url.toString()).then((res) => res.text());
    const requestKey: string | undefined = requestAns.split('=')[1];

    if (requestKey) {
      response.redirect(
        `${config.hostUrl}/requestauth?requestkey=${requestKey}`,
      );
    } else {
      return response.badRequest({
        errors: ['Empty body response from tequila'],
      });
    }
  } catch (err) {
    return response.badRequest({ errors: [err.message] });
  }
});

Route.get(
  '/validate',
  async ({ request, response, auth, session }: HttpContextContract) => {
    const responseKey = request.param('key');
    session.put('tequila.key', responseKey);
    try {
      const url = new URL(`${config.hostUrl}/fetchattributes`);
      url.searchParams.append('key', responseKey);
      const authUser = await fetch(url.toString());

      const tequilaUser: TequilaUser = await authUser.json();
      const internalUser = await UserManager.getUser(
        'tequila',
        tequilaUser.uniqueid,
        tequilaUser.email,
      );
      if (!internalUser) {
        return response.internalServerError({ errors: ['Failed to get user'] });
      }

      if (
        tequilaUser.email &&
        !internalUser.emails.includes(tequilaUser.email)
      ) {
        internalUser.emails.push(tequilaUser.email);
      }
      if (tequilaUser.name && internalUser.lastName !== tequilaUser.name) {
        internalUser.lastName = tequilaUser.name;
      }
      if (
        tequilaUser.firstname &&
        internalUser.firstName !== tequilaUser.firstname
      ) {
        internalUser.firstName = tequilaUser.firstname;
      }
      await internalUser.save();

      await auth.login(internalUser);
      session.put('mylims.auth.method', 'tequila');

      return response.ok(tequilaUser);
    } catch (err) {
      return response.badRequest({ errors: [err.message] });
    }
  },
);
