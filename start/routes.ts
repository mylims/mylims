import Application from '@ioc:Adonis/Core/Application';
import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';
import ApolloServer from '@ioc:Apollo/Server';

import * as AddonsManager from 'App/AddonsManager';
import Credential from 'App/Models/Credential';
import User from 'App/Models/User';
import { ObjectId } from 'mongodb';

// Local user authentication
Route.group(() => {
  Route.post('/', async ({ request }) => {
    const { lastname, firstname, email } = request.all();
    const user = await User.create({
      lastname,
      firstname,
      emails: [email],
      role: 'MEMBER',
    });

    return Route.makeSignedUrl('setPassword', {
      params: {
        userId: user._id,
      },
    });
  });

  Route.post('/password/:userId', async ({ request, response, params }) => {
    const { password } = request.all();
    const { userId } = params;

    console.log(userId);
    const user = await User.findById(new ObjectId(userId));
    console.log('user', user);
    if (user === null) return response.notFound(user);

    const credential = new Credential();
    console.log('credential', credential);
    if (credential === null) return response.notFound(credential);
    credential.hash = await Hash.make(password);

    await credential.save();

    user.authMethods = { local: String(credential.id) };
    return user.save();
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
  Route.get('/', 'AuthController.myself');
  Route.post('local', 'AuthController.login');
  Route.get('/logout', 'AuthController.logout');
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
AddonsManager.registerRoutes(Route);

const apolloGroup = Route.group(() => {
  ApolloServer.applyMiddleware({ Route });
});

if (Application.inProduction) {
  apolloGroup.middleware('auth');
}
