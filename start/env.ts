import Env from '@ioc:Adonis/Core/Env';

declare module '@ioc:Adonis/Core/Env' {
  interface EnvTypes {
    NODE_ENV: 'development' | 'production';
  }
}

Env.rules({
  NODE_ENV: Env.schema.enum(['development', 'production'] as const),
});

Env.process();
