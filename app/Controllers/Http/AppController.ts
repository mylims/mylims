import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AppController {
  public async home(ctx: HttpContextContract) {
    return ctx.view.render('index', {
      isLoggedIn: ctx.auth.isLoggedIn,
      user: ctx.auth.user,
    });
  }
}
