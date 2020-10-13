import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { getAllConfig } from 'App/AppConfig';

export default class AdminsController {
  // Ask for admin password
  public async login({ view }: HttpContextContract) {
    return view.render('admin/login');
  }

  // Displays error and ask for admin password
  public async error({ params, view }: HttpContextContract) {
    const errors: Record<string, string> = {
      wrong: 'Wrong password',
      missing: 'Missing admin password',
    };
    const error = (params.error && errors[params.error]) || 'Error';
    return view.render('admin/login', { error });
  }

  // Displays config values
  public async config({ view }: HttpContextContract) {
    const config = getAllConfig();
    const dateValue = new Date(config.date).toLocaleDateString('fr-CH');
    return view.render('admin/config', { config, dateValue });
  }

  // Validates the admin password
  public async auth({ request, response }: HttpContextContract) {
    const pass = request.input('password');
    const adminPass = Env.get('ADMIN_PASSWORD');

    if (!adminPass) return response.redirect('/admin/error/missing');

    return pass !== adminPass
      ? response.redirect('/admin/error/wrong')
      : response.redirect('/admin/config');
  }
}
