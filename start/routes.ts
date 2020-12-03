import Application from '@ioc:Adonis/Core/Application';
import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';
import ApolloServer from '@ioc:Apollo/Server';

import * as AddonsManager from 'App/AddonsManager';
import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

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
}).prefix('/users');

// Super admin views
Route.group(() => {
  Route.get('/', 'AdminsController.renderLogin');
  Route.get('/config', 'AdminsController.renderConfig').middleware('admin');
  Route.get('/addons', 'AdminsController.renderAddons').middleware('admin');

  Route.post('/auth', 'AdminsController.auth');
  Route.post('/config', 'AdminsController.changeConf').middleware('admin');
  Route.post('/addons', 'AdminsController.addons').middleware('admin');
}).prefix('/admin');

Route.group(() => {
  Route.post('local', 'AuthController.login');
}).prefix('/auth');

Route.group(() => {
  Route.group(() => {
    Route.get('/create', 'TestLocalAuthController.create');
    Route.get('/login', 'TestLocalAuthController.login');
    Route.get('/user', 'TestLocalAuthController.user');
    Route.get('/logout', 'TestLocalAuthController.logout');
  }).prefix('local');

  Route.group(() => {
    Route.get('/create', 'TestLdapAuthController.create');
    Route.get('/login', 'TestLdapAuthController.login');
    Route.get('/user', 'TestLdapAuthController.user');
    Route.get('/logout', 'TestLdapAuthController.logout');
  }).prefix('ldap');
}).prefix('/test-auth');

// Require routes from addons
// eslint-disable-next-line no-console
AddonsManager.registerRoutes().catch((err) => console.log(err));

const apolloGroup = Route.group(() => {
  ApolloServer.applyMiddleware({ Route });
});

if (Application.inProduction) {
  apolloGroup.middleware('auth');
}
