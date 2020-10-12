import uuid from '@lukeed/uuid';

import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';

import { registerRoutes } from 'App/AddonsManager';
import Credential from 'App/Models/CredentialModel';
import User from 'App/Models/UserModel';

Route.get('/', async () => {
  return { hello: 'world' };
});

Route.post('/user', async ({ request }) => {
  const { lastname, firstname, email } = request.all();
  const credential = await Credential.create({
    resetToken: uuid(),
  });
  await User.create({
    lastname,
    firstname,
    email,
    auth: { local: credential._id },
  });
  return true;
});

Route.post('/user/password', async ({ request }) => {
  const { token, password } = request.all();
  const credentials = await Credential.findOne({ resetToken: token });
  if (credentials === null) throw new Error('bad token');
  credentials.resetToken = null;
  credentials.hash = await Hash.make(password);
  return credentials.save();
});
// Super admin views
Route.group(() => {
  Route.get('/', 'AdminsController.login');
  Route.post('/auth', 'AdminsController.auth');
  Route.get('/error/:error?', 'AdminsController.error');
}).prefix('/admin');

// Require route from addons
registerRoutes();
