import ms from 'ms';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class Admin {
  private readonly cookieName = 'sudo';
  private readonly sessionError = 'Session is not valid';

  public async handle(
    { session, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const cookie = session.get(this.cookieName);
    if (!cookie) {
      session.flash('error', this.sessionError);
      return response.redirect('/admin');
    }

    // Checks time is valid
    const currDate = new Date();
    const sessionDate = new Date(cookie as string | number);
    const diffMilSec = currDate.getTime() - sessionDate.getTime();
    const windowTime = ms('20m');
    if (diffMilSec < 0 || diffMilSec >= windowTime) {
      session.forget(this.cookieName);
      session.flash('error', this.sessionError);
      return response.redirect('/admin');
    }
    await next();
  }
}
