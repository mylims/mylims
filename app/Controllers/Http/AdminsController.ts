import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AdminsController {
  // Ask for admin password
  public async login({ view }: HttpContextContract) {
    return view.render('admin/login');
  }

  // Validates the admin password
  public async auth({ request, response }: HttpContextContract) {
    const pass = request.input('password');
    const adminPass = Env.get('ADMIN_PASSWORD');

    if (!adminPass) return response.redirect('/admin/error/missing');

    return pass !== adminPass
      ? response.redirect('/admin/error/wrong')
      : response.redirect('/admin/error/missing');
  }

  // Displays error and ask for admin password
  public async error({ params, view }: HttpContextContract) {
    const errors = {
      wrong: 'Wrong password',
      missing: 'Missing admin password',
    };
    const error = (params.error && errors[params.error]) || 'Error';
    return view.render('admin/login', { error });
  }
}
