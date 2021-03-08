import ms from 'ms';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

const sessionField = 'mylims.admin.sudo';
const sudoDuration = ms('5m');
const sudoError = 'Login required';

export default class Admin {
  public async handle(
    { session, response }: HttpContextContract,
    next: () => Promise<void>,
  ) {
    const sudo = session.pull(sessionField);
    if (!sudo) {
      session.flash('error', sudoError);
      return response.redirect('/admin');
    }

    // Check that the session is still valid.
    const currDate = Date.now();
    const diffMilSec = currDate - sudo;
    if (diffMilSec < 0 || diffMilSec >= sudoDuration) {
      session.flash('error', sudoError);
      return response.redirect('/admin');
    } else {
      // Renew the session
      session.put(sessionField, currDate);
    }
    await next();
  }
}
