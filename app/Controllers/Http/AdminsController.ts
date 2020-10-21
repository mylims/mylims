import { MongoClient } from 'mongodb';
import ms from 'ms';

import Env from '@ioc:Adonis/Core/Env';
import Event from '@ioc:Adonis/Core/Event';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { getAllConfig, setConfig } from 'App/AppConfig';

export default class AdminsController {
  // Ask for admin password
  public async renderLogin({ view }: HttpContextContract) {
    return view.render('admin/login');
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
    if (!adminPass) {
      session.flash('error', 'Missing admin password');
      return response.redirect().back();
    }
    if (pass !== adminPass) {
      session.flash('error', 'Wrong password');
      return response.redirect().back();
    }

    // Sets the session cookie and go to config menu
    session.put('sudo', new Date().getTime());
    return response.redirect('/admin/config');
  }

  // Modifies the config file
  public async changeConf({ request, response }: HttpContextContract) {
    const { confkey: confKey, ...currConf } = request.all();
    switch (confKey) {
      case undefined:
      case null: {
        break;
      }

      case 'mongodb': {
        const { url } = currConf;
        const { status } = await this.testMongoConnection(url);
        if (status) setConfig(confKey, currConf);
        break;
      }

      case 'session': {
        const { sessionAge } = currConf;
        const { status } = this.testSessionAge(sessionAge);
        if (status) setConfig(confKey, currConf);
        break;
      }

      default: {
        setConfig(confKey, currConf);
        break;
      }
    }

    // TODO(xstoudi): fix this in Adonis
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Event.emit('mylims:restart', 'config update');
    response.redirect('/admin/config');
  }

  private async testMongoConnection(
    mongoUrl: string,
  ): Promise<{ status: boolean }> {
    try {
      const connection = await MongoClient.connect(mongoUrl);
      const status = connection.isConnected();
      await connection.close();
      return { status };
    } catch (error) {
      return { status: false };
    }
  }

  private testSessionAge(age: string) {
    try {
      return { status: !!ms(age) };
    } catch (error) {
      return { status: false };
    }
  }
}
