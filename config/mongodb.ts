import Env from '@ioc:Adonis/Core/Env';
import { MongodbConfig } from '@ioc:Mongodb/Database';

const config: MongodbConfig = {
  default: 'mongodb',
  connections: {
    mongodb: {
      url: Env.getOrFail('MONGODB_URL') as string,
      database: Env.getOrFail('MONGODB_DATABASE') as string,
    },
  },
};

export default config;
