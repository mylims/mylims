import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';

import { registerRoutes } from 'App/AddonsManager';
import Credential from 'App/Models/CredentialModel';
import User from 'App/Models/UserModel';

Route.get('/', async () => {
  return { hello: 'world' };
});

Route.post('/users', async ({ request }) => {
  const { lastname, firstname, email } = request.all();
  const credential = await Credential.create({
    email,
  });
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

Route.post('/users/password/:email', async ({ request, params }) => {
  if (request.hasValidSignature()) {
    const { password } = request.all();
    const { email } = params;
    const credentials = await Credential.findOne({ email });
    if (credentials === null) throw new Error('credential not found');
    credentials.hash = await Hash.make(password);
    await credentials.save();
    return 'Email validated, password set.';
  }
  return 'Url is not valid';
}).as('setPassword');

Route.post('/login', async ({ auth, request }) => {
  const { email, password } = request.all();
  await auth.use('local').attempt(email, password);
  // eslint-disable-next-line no-console
  console.log(auth.user);
  return { test: true };
});

// Require route from addons
registerRoutes();
