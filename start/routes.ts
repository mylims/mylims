import uuid from '@lukeed/uuid';

import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';
import { Credential, User } from '@ioc:Zakodium/User';

import { registerRoutes } from 'App/AddonsManager';

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

// Require route from addons
registerRoutes();
