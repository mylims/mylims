import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

const authConfig: AuthConfig = {
  guard: 'web',
  list: {
    web: {
      driver: 'session',
      provider: {
        driver: 'mongodb-model',
      },
    },
  },
};

export default authConfig;
