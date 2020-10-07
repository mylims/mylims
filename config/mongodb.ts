import { MongodbConfig } from '@ioc:Mongodb/Database';

import { config as configFile } from './config.json';

const config: MongodbConfig = {
  default: 'mongodb',
  connections: { mongodb: configFile.mongodb },
};

export default config;
