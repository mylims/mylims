import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import isEqual from 'lodash.isequal';

const { config, history } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'),
);

export interface ConfigProps {
  date: string;
  appKey: string;
  ldap: {
    id: string;
    uid: string;
    url: string;
    appDN: string;
    appPassword: string;
    baseUserDN: string;
  };
  mongodb: {
    url: string;
    database: string;
  };
  session: {
    sessionAge?: string;
  };
}

export function getConfig<T extends keyof ConfigProps>(key: T): ConfigProps[T] {
  return (config as ConfigProps)[key];
}

export function getAllConfig() {
  return {
    date: getConfig('date'),
    appKey: getConfig('appKey'),
    ldap: getConfig('ldap'),
    mongodb: getConfig('mongodb'),
    session: getConfig('session'),
  };
}

export function setConfig<T extends keyof ConfigProps>(
  key: T,
  newConfig: ConfigProps[T],
) {
  const currConf = getConfig(key);
  if (!isEqual(currConf, newConfig)) {
    const confToSave = {
      config: {
        ...config,
        [key]: newConfig,
        date: new Date().toISOString(),
        appKey: randomString(32),
      },
      history: [config, ...history],
    };

    fs.writeFileSync(
      path.join(__dirname, 'config.json'),
      JSON.stringify(confToSave),
    );
  }
}

export function randomString(len: number) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex')
    .substring(0, len)
    .toString();
}
