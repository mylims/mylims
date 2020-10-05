import Route from '@ioc:Adonis/Core/Route';

Route.get('/login', async ({ auth }) => {
  await auth.attempt('user02', 'password2');
  // eslint-disable-next-line no-console
  console.log(auth.user);
  return { test: true };
});

Route.get('/user', async ({ auth }) => {
  // eslint-disable-next-line no-console
  console.log(auth.user);
}).middleware('auth');
