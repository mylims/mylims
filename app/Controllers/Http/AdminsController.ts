import Env from '@ioc:Adonis/Core/Env';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AdminsController {
  public async login({ view }: HttpContextContract) {
    return view.render('admin/login');
  }

  public async auth({ request, view }: HttpContextContract) {
    const pass = request.input('password');
    const adminPass = Env.get('ADMIN_PASSWORD');

    if (!adminPass) {
      return view.render('admin/login', { error: 'Missing admin password' });
    }

    return pass !== adminPass
      ? view.render('admin/login', { error: 'Wrong password' })
      : view.render('admin/login');
  }
}
