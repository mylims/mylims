import type { MiddlewareHandler } from '@ioc:Adonis/Core/Middleware';
import Server from '@ioc:Adonis/Core/Server';

Server.middleware.register([
  (() => import('@ioc:Adonis/Core/BodyParser')) as MiddlewareHandler,
]);
Server.middleware.registerNamed({
  auth: 'App/Middleware/Auth',
  silentAuth: 'App/Middleware/SilentAuth',
  sudo: 'App/Middleware/Sudo',
});
