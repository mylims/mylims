import Application from '@ioc:Adonis/Core/Application';
import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';
import ApolloServer from '@ioc:Zakodium/Apollo/Server';

import * as AddonsManager from 'App/AddonsManager';
import Credential from 'App/Models/Credential';
import User from 'App/Models/User';

Route.get('/', (ctx) => {
  ctx.response.redirect('/admin');
});

// Local user authentication
Route.group(() => {
  Route.post('/', async ({ request }) => {
    const { lastname, firstname, email } = request.all();
    const credential = await Credential.create({ email });
    await User.create({
      lastName: lastname as string,
      firstName: firstname as string,
      emails: [email],
      authMethods: { local: credential._id.toHexString() },
    });

    return Route.makeSignedUrl('setPassword', { params: { email } });
  });

  Route.post('/password/:email', async ({ request, response, params }) => {
    const { password } = request.all();
    const { email } = params;
    const credentials = await Credential.findBy('email', email);
    if (credentials === null) return response.notFound(email);
    credentials.hash = await Hash.make(password);
    return credentials.save();
  }).as('setPassword');
}).prefix('/users');

// Super admin views
Route.group(() => {
  Route.get('/', 'AdminsController.renderLogin');
  Route.post('/auth', 'AdminsController.auth');
  Route.group(() => {
    Route.get('/config', 'AdminsController.renderConfig');
    Route.get('/addons', 'AdminsController.renderAddons');
    Route.post('/config', 'AdminsController.changeConf');
    Route.post('/addons', 'AdminsController.addons');
  }).middleware('sudo');
}).prefix('/admin');

Route.group(() => {
  Route.get('/', 'AuthController.myself').middleware('silentAuth');
  Route.post('/local', 'AuthController.login');
  Route.post('/logout', 'AuthController.logout');
}).prefix('/auth');

Route.group(() => {
  Route.get('/file/:id', 'MeasurementController.fetch');
  Route.post('/create', 'MeasurementController.create');
})
  .middleware('auth')
  .prefix('/measurements');

// Require routes from addons
AddonsManager.registerRoutes(Route);

const apolloGroup = Route.group(() => {
  ApolloServer.applyMiddleware();
});

if (Application.inProduction) {
  apolloGroup.middleware('auth');
}
