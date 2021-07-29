import { MongodbConfig } from '@ioc:Zakodium/Mongodb/Database';

import { getConfig } from '../app/AppConfig';

const mongodb = getConfig('mongodb');
const config: MongodbConfig = {
  connection: 'mongodb',
  connections: { mongodb },
};

export default config;
