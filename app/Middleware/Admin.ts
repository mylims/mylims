import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Admin {
  private readonly cookieName = 'sudo';

  public async handle(
    { session, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const cookie = session.get(this.cookieName);
    if (!cookie) return response.redirect('/admin/error/session');

    // Checks time is valid
    const currDate = new Date();
    const sessionDate = new Date(cookie as string | number);
    const diffMilSec = currDate.getTime() - sessionDate.getTime();
    const windowTime = 1000 * 60 * 20; // 20 mins
    if (diffMilSec < 0 || diffMilSec >= windowTime) {
      session.forget(this.cookieName);
      return response.redirect('/admin/error/session');
    }
    await next();
  }
}
