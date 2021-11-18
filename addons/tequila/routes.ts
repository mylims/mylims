import fetch from 'node-fetch';

import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import UserManager from '@ioc:Zakodium/User';

import { ConfigProps, getConfig } from 'App/AppConfig';

import { objectToUrl, reconciliate, textToObject } from './utils';

const config: ConfigProps['tequila'] = getConfig('tequila');

const userFields = ['name', 'firstname', 'email', 'uniqueid'] as const;
const requestBody: Record<string, string | undefined> = {
  urlaccess: `${Env.get('BACKEND_URL')}/addons/tequila/validate`,
  request: userFields.join(','),
  service: config.serviceName,
};

Route.get('/login', async ({ response }: HttpContextContract) => {
  try {
    const requestAns = await fetch(
      objectToUrl(`${config.hostUrl}/createrequest`, requestBody),
    ).then((res) => res.text());
    const requestKey: string | undefined = requestAns.split('=')[1];

    if (requestKey) {
      response.redirect(
        `${config.hostUrl}/requestauth?requestkey=${requestKey.trim()}`,
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
    // Save session key
    const responseKey = request.all().key.trim();
    if (!responseKey) {
      return response.internalServerError({ errors: ['Empty response key'] });
    }
    session.put('tequila.key', responseKey);

    try {
      // Constructs query url
      const url = `${config.hostUrl}/fetchattributes?key=${responseKey}`;
      const authUser = await fetch(url);
      if (authUser.status !== 200) {
        return response.internalServerError({ errors: [authUser.statusText] });
      }

      const tequilaResponse = await authUser.text();
      const tequilaUser = textToObject(tequilaResponse);
      if (!tequilaUser.uniqueid) return response.ok(authUser);

      const internalUser = await UserManager.getUser(
        'tequila',
        tequilaUser.uniqueid,
        tequilaUser.email,
      );
      if (!internalUser) {
        return response.internalServerError({ errors: ['Failed to get user'] });
      }

      // Update user information
      await reconciliate(internalUser, tequilaUser);
      await auth.login(internalUser);
      session.put('mylims.auth.method', 'tequila');

      return response.redirect(`${Env.get('FRONTEND_URL')}/measurement/list`);
    } catch (err) {
      return response.badRequest({ errors: [err.message] });
    }
  },
);
