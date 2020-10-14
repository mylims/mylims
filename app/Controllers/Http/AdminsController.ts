import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { getAllConfig, getConfig, setConfig } from 'App/AppConfig';

export default class AdminsController {
  // Ask for admin password
  public async renderLogin({ view }: HttpContextContract) {
    return view.render('admin/login');
  }

  // Displays error and ask for admin password
  public async renderError({ params, view }: HttpContextContract) {
    const errors: Record<string, string> = {
      wrong: 'Wrong password',
      missing: 'Missing admin password',
      session: 'Session is not valid',
    };
    const error = (params.error && errors[params.error]) || 'Error';
    return view.render('admin/login', { error });
  }

  // Displays config values
  public async renderConfig({ view }: HttpContextContract) {
    const config = getAllConfig();
    return view.render('admin/config', { config });
  }

  // Validates the admin password
  public async auth({ request, response, session }: HttpContextContract) {
    const pass = request.input('password');
    const adminPass = Env.get('ADMIN_PASSWORD');

    // Pasword validation
    if (!adminPass) return response.redirect('/admin/error/missing');
    if (pass !== adminPass) return response.redirect('/admin/error/wrong');

    // Sets the session cookie and go to config menu
    session.put('sudo', new Date().getTime());
    return response.redirect('/admin/config');
  }

  // Modifies the config file
  public async changeConf({ request, response }: HttpContextContract) {
    const { confkey: confKey, ...currConf } = request.all();
    if (confKey) {
      const authList = ['ldap'];
      if (authList.includes(confKey)) {
        const auth = getConfig('auth');
        setConfig('auth', { ...auth, [confKey]: currConf });
      } else {
        setConfig(confKey, currConf);
      }
    }
    response.redirect('/admin/config');
  }
}
