import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import UserManager from '@ioc:Zakodium/User';

import { getConfig } from 'App/AppConfig';

export interface TequilaProviderConfig {
  hostUrl: string;
  serviceName: string;
  groupName?: string;
}

const config: TequilaProviderConfig = getConfig('tequila');
const body: Record<string, string | undefined> = {
  urlacces: `${Env.get('BACKEND_URL')}/tequila/validate`,
  service: config.serviceName,
  request: 'name,firstname',
  require: config.groupName && `group=${config.groupName}`,
};

Route.post('/login', async ({ response }: HttpContextContract) => {
  try {
    const requestKey = await fetch(`${config.hostUrl}/createrequest`, {
      method: 'POST',
      body: Object.keys(body)
        .filter((key) => !!body[key])
        .map((key) => `${key}=${body[key] as string}`)
        .join('\n'),
      credentials: 'include',
    });
    if (requestKey.body !== null) {
      response.redirect(
        `${config.hostUrl}/requestauth?requestkey=${String(requestKey.body)}`,
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
    try {
      const authUser = await fetch(`${config.hostUrl}/fetchattributes`, {
        method: 'POST',
        body: `key=${responseKey}`,
        credentials: 'include',
      });
      const tequilaUser: Record<string, string> = await authUser.json();
      const internalUser = await UserManager.getUser(
        'tequila',
        tequilaUser.user, // username
        tequilaUser.email,
      );
      if (!internalUser) {
        return response.internalServerError({ errors: ['Failed to get user'] });
      }

      await auth.login(internalUser);
      session.put('mylims.auth.method', 'tequila');

      if (
        tequilaUser.email &&
        !internalUser.emails.includes(tequilaUser.email)
      ) {
        internalUser.emails.push(tequilaUser.email);
      }
      await internalUser.save();

      return response.ok(tequilaUser);
    } catch (err) {
      return response.badRequest({ errors: [err.message] });
    }
  },
);
