import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { isDeepStrictEqual } from 'util';

const defaultConfig: ConfigFile = {
  config: {
    appKey: randomString(32),
    date: '2020-10-07T14:48:00.000Z',
    ldap: {
      id: 'uid',
      uid: 'uid',
      url: 'ldap://127.0.0.1:1389',
      appDN: 'cn=admin,dc=example,dc=org',
      appPassword: 'adminpassword',
      baseUserDN: 'ou=users,dc=example,dc=org',
    },
    tequila: {
      hostUrl: 'https://test-tequila.epfl.ch/cgi-bin/tequila',
      serviceName: 'myLIMS',
    },
    mongodb: { url: 'mongodb://localhost:27017', database: 'mylims' },
    session: { sessionAge: '2h' },
    fileSync: { root: '' },
    enabledAddons: ['events'],
  },
  history: [],
};

const configPath = path.join(__dirname, 'config.json');

if (fs.existsSync(configPath) === false) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
}
const { config, history } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export interface ConfigFile {
  config: ConfigProps;
  history: ConfigProps[];
}
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
  tequila: {
    hostUrl: string;
    serviceName: string;
  };
  mongodb: {
    url: string;
    database: string;
  };
  session: {
    sessionAge?: string;
  };
  fileSync: {
    root: string;
  };
  enabledAddons: string[];
}

export function getConfig<T extends keyof ConfigProps>(key: T): ConfigProps[T] {
  return (config as ConfigProps)[key];
}

export function getAllConfig(): ConfigProps {
  return config;
}

export function setConfig<T extends keyof ConfigProps>(
  key: T,
  newConfig: ConfigProps[T],
) {
  const currConf = getConfig(key);
  if (!isDeepStrictEqual(currConf, newConfig)) {
    const confToSave = {
      config: {
        ...config,
        [key]: newConfig,
        date: new Date().toISOString(),
      },
      history: [config, ...history],
    };

    fs.writeFileSync(
      path.join(__dirname, 'config.json'),
      JSON.stringify(confToSave, null, 2),
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
