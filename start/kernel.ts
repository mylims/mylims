import Server from '@ioc:Adonis/Core/Server';

Server.middleware.register(['Adonis/Core/BodyParserMiddleware']);
Server.middleware.registerNamed({
  auth: 'App/Middleware/Auth',
  silentAuth: 'App/Middleware/SilentAuth',
});
