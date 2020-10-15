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
    const credential = await Credential.create({ email });
    await User.create({
      lastname,
      firstname,
      email,
      auth: { local: credential._id },
    });

    return Route.makeSignedUrl('setPassword', {
      params: {
        email,
      },
    });
  });

  Route.post('/password/:email', async ({ request, response, params }) => {
    const { password } = request.all();
    const { email } = params;
    const credentials = await Credential.findOne({ email });
    if (credentials === null) return response.notFound(email);
    credentials.hash = await Hash.make(password);
    return credentials.save();
  }).as('setPassword');

  Route.post('/login', async ({ request, auth }) => {
    const { email, password } = request.all();
    const x = await auth.use('local').attempt(email, password);
    return x.email;
  });
}).prefix('/users');

// Super admin views
Route.group(() => {
  Route.get('/', 'AdminsController.login');
  Route.get('/error/:error?', 'AdminsController.error');
  Route.get('/config', 'AdminsController.config');

  Route.post('/auth', 'AdminsController.auth');
}).prefix('/admin');

// Require route from addons
registerRoutes();
