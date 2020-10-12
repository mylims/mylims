import { CrendentialsBuilder } from 'Providers/local-user-auth/models/CredentialsModel';
import { UserBuilder } from 'Providers/user/UserModel';
import { v4 as uuidv4 } from 'uuid';

import Hash from '@ioc:Adonis/Core/Hash';
import Route from '@ioc:Adonis/Core/Route';
import { Model } from '@ioc:Mongodb/Model';

import { registerRoutes } from 'App/AddonsManager';

const Credentials = CrendentialsBuilder(Model);
const User = UserBuilder(Model);

Route.get('/', async () => {
  return { hello: 'world' };
});

Route.post('/user', async ({ request }) => {
  const { lastname, firstname, email } = request.all();
  const credential = await Credentials.create({
    resetToken: uuidv4(),
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
  const credentials = await Credentials.findOne({ resetToken: token });
  if (credentials === null) throw new Error('bad token');
  credentials.resetToken = null;
  credentials.hash = await Hash.make(password);
  return credentials.save();
});

// Require route from addons
registerRoutes();
