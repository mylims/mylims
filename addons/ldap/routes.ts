import Route from '@ioc:Adonis/Core/Route';

Route.post('/login', async ({ request, auth }) => {
  const { username, password } = request.post();
  const ldapauth = auth.use('ldap');
  const user = await ldapauth.attempt(username, password);
  return user.id;
});
