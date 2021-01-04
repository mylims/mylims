import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  ADMIN_PASSWORD: Env.schema.string(),
  BACKEND_URL: Env.schema.string(),
  FRONTEND_URL: Env.schema.string(),
});
