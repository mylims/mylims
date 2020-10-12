import Route from '@ioc:Adonis/Core/Route';

const routePrefix = '/addons/local';

Route.get(`${routePrefix}/register`, async () => {
  // create credentials
  // create user with link to credentials
});

Route.get(`${routePrefix}/login`, async ({ auth }) => {
  await auth.use('local').attempt('xavier@stouder.io', 'root');
  // eslint-disable-next-line no-console
  console.log(auth.user);
  return { test: true };
});

Route.get(`${routePrefix}/user`, async ({ auth }) => {
  // eslint-disable-next-line no-console
  console.log(auth.user);
}).middleware('auth');
