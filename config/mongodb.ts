import { MongodbConfig } from '@ioc:Mongodb/Database';

import { getConfig } from '../app/AppConfig';

const mongodb = getConfig('mongodb');
const config: MongodbConfig = {
  default: 'mongodb',
  connections: { mongodb },
};

export default config;
