import Route from '@ioc:Adonis/Core/Route';

import { registerRoutes } from 'App/AddonsManager';

Route.get('/', async () => {
  return { hello: 'world' };
});

// Require route from addons
registerRoutes();
