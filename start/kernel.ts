import Server from '@ioc:Adonis/Core/Server';

Server.middleware.register(['Adonis/Core/BodyParser']);
Server.middleware.registerNamed({
  auth: 'App/Middleware/Auth',
  silentAuth: 'App/Middleware/SilentAuth',
  sudo: 'App/Middleware/Sudo',
});
