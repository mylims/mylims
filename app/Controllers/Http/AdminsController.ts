import { MongoClient } from 'mongodb';
import ms from 'ms';

import Env from '@ioc:Adonis/Core/Env';
import Event from '@ioc:Adonis/Core/Event';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { getAddons } from 'App/AddonsManager';
import { getAllConfig, setConfig } from 'App/AppConfig';
import Addon from 'App/Components/admin/Addon';
import Config from 'App/Components/admin/Config';
import Login from 'App/Components/admin/Login';

const adminPass = Env.get('ADMIN_PASSWORD');
const backendUrl = Env.get('BACKEND_URL');

export default class AdminsController {
  // Ask for admin password
  public async renderLogin({ react }: HttpContextContract) {
    return react.render(Login);
  }

  // Displays config values
  public async renderConfig({ react }: HttpContextContract) {
    const config = getAllConfig();
    return react.render(Config, { config });
  }

  public async renderAddons({ react }: HttpContextContract) {
    const availableAddons = getAddons();
    return react.render(Addon, { availableAddons });
  }

  // Validates the admin password
  public async auth({ request, response, session }: HttpContextContract) {
    const pass = request.input('password');

    // Password validation
    if (!adminPass) {
      session.flash('error', 'Missing admin password');
      return response.redirect().back();
    }
    if (pass !== adminPass) {
      session.flash('error', 'Wrong password');
      return response.redirect().back();
    }

    // Sets the session cookie and go to config menu
    session.put('mylims.admin.sudo', Date.now());
    return response.redirect(`${backendUrl}/admin/config`);
  }

  // Modifies the config file
  public async changeConf({ request, response, session }: HttpContextContract) {
    const { confkey: confKey, ...currConf } = request.all();
    let error: string | null = null;
    switch (confKey) {
      case undefined:
      case null: {
        break;
      }

      case 'mongodb': {
        const { url } = currConf;
        const { status } = await this.testMongoConnection(url);
        if (status) {
          setConfig(confKey, currConf);
        } else {
          error = 'Invalid mongoDB url';
        }
        break;
      }

      case 'session': {
        const { sessionAge } = currConf;
        const { status } = this.testSessionAge(sessionAge);
        if (status) {
          setConfig(confKey, currConf);
        } else {
          error = 'Invalid session age';
        }
        break;
      }

      case 'fileSync': {
        const { interval, root } = currConf;
        if (interval && interval !== '0') {
          setConfig(confKey, currConf);
        } else {
          setConfig(confKey, { root });
        }
        break;
      }

      default: {
        setConfig(confKey, currConf);
        break;
      }
    }

    if (error) {
      session.flash('error', error);
      response.internalServerError(error);
    } else {
      Event.emit('mylims:restart', 'config update');
      response.redirect(`${backendUrl}/admin/config`);
    }
  }

  public async addons({ request, response }: HttpContextContract) {
    const newlyEnabledAddons = Object.keys(request.all());
    setConfig('enabledAddons', newlyEnabledAddons);
    Event.emit('mylims:restart', 'update loaded addons');
    response.redirect(`${backendUrl}/admin/addons`);
  }

  private async testMongoConnection(
    mongoUrl: string,
  ): Promise<{ status: boolean }> {
    try {
      const connection = await MongoClient.connect(mongoUrl);
      await connection.close();
      return { status: true };
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
