import fs from 'fs';
import path from 'path';

const { config } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'),
);

export interface ConfigProps {
  date: string;
  app: {
    appKey: string;
    appName: string;
    logLevel: string;
  };
  auth: {
    ldap: {
      id: string;
      uid: string;
      url: string;
      appDN: string;
      appPassword: string;
      baseUserDN: string;
    };
  };
  mongodb: {
    url: string;
    database: string;
  };
  session: {
    driver: 'cookie' | 'file' | 'redis';
    cookieName: string;
    sessionAge?: string;
  };
}

export function getConfig<T extends keyof ConfigProps>(key: T): ConfigProps[T] {
  return (config as ConfigProps)[key];
}

export function getAllConfig() {
  return {
    date: getConfig('date'),
    app: getConfig('app'),
    auth: getConfig('auth'),
    mongodb: getConfig('mongodb'),
    session: getConfig('session'),
  };
}
