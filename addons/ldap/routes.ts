import Route from '@ioc:Adonis/Core/Route';

const routePrefix = '/addons/ldap';

Route.get(`${routePrefix}/login`, async ({ auth }) => {
  await auth.use('ldap').attempt('user02', 'password2');
  // eslint-disable-next-line no-console
  console.log(auth.user);
  return { test: true };
});

Route.get(`${routePrefix}/user`, async ({ auth }) => {
  // eslint-disable-next-line no-console
  console.log(auth.user);
}).middleware('auth');
