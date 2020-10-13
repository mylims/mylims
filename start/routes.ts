import uuid from '@lukeed/uuid';

import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';

import { registerRoutes } from 'App/AddonsManager';
import Credential from 'App/Models/CredentialModel';
import User from 'App/Models/UserModel';

Route.get('/', async () => ({ hello: 'world' }));

// Local user authentication
Route.group(() => {
  Route.post('/', async ({ request }) => {
    const { lastname, firstname, email } = request.all();
    const credential = await Credential.create({ resetToken: uuid() });
    await User.create({
      lastname,
      firstname,
      email,
      auth: { local: credential._id },
    });
    return true;
  });

  Route.post('/password', async ({ request }) => {
    const { token, password } = request.all();
    const credentials = await Credential.findOne({ resetToken: token });
    if (credentials === null) throw new Error('bad token');
    credentials.resetToken = null;
    credentials.hash = await Hash.make(password);
    return credentials.save();
  });
}).prefix('/user');

// Super admin views
Route.group(() => {
  Route.get('/', 'AdminsController.login');
  Route.get('/error/:error?', 'AdminsController.error');
  Route.get('/config', 'AdminsController.config');

  Route.post('/auth', 'AdminsController.auth');
}).prefix('/admin');

// Require route from addons
registerRoutes();
