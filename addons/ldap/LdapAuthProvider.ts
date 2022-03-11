import { promisify } from 'util';

import * as ldap from 'ldapjs';

import logger from '@ioc:Adonis/Core/Logger';
import UserManager from '@ioc:Zakodium/User';

import { getConfig } from 'App/AppConfig';
import User from 'App/Models/User';

export interface LdapProviderConfig {
  appDN: string;
  appPassword: string;
  baseUserDN: string;
  uid: string;
  id: string;
  url: string;
}

const config: LdapProviderConfig = getConfig('ldap');

export async function attempt(
  uid: string,
  password: string,
): Promise<User | null> {
  const userClient = ldap.createClient({ url: config.url });
  // bad password or bind failed
  if ((await bind(userClient, uid, password)) === false) return null;
  try {
    const ldapEntry = await searchUser(userClient, uid);
    if (ldapEntry !== null) {
      const { mail } = ldapEntry;
      const id = ldapEntry[config.id];
      const internalUser = await UserManager.getUser(
        'ldap',
        Array.isArray(id) ? id[0] : id,
        { email: Array.isArray(mail) ? mail[0] : mail },
      );
      await reconciliate(internalUser, ldapEntry);
      return internalUser;
    }
    return null;
  } catch (err) {
    logger.error(err, 'failed to search');
    return null;
  } finally {
    userClient.destroy();
  }
}

async function searchUser(
  userClient: ldap.Client,
  uid: string,
): Promise<ldap.SearchEntryObject | null> {
  const ldapSearch = promisify<
    string,
    ldap.SearchOptions,
    ldap.SearchCallbackResponse
  >(userClient.search.bind(userClient));

  const response = await ldapSearch(config.baseUserDN, {
    filter: `(${config.uid}=*${uid}*)`,
    scope: 'sub',
  });
  const foundEntries: ldap.SearchEntryObject[] = [];
  response.on('searchEntry', (entry) => {
    foundEntries.push(entry.object);
  });

  return new Promise((resolve) => {
    response.on('end', () => {
      if (foundEntries.length > 0) {
        return resolve(foundEntries[0]);
      } else {
        return resolve(null);
      }
    });
  });
}

async function bind(userClient: ldap.Client, uid: string, password: string) {
  const clientBind = promisify<string, string, void>(
    userClient.bind.bind(userClient),
  );
  try {
    await clientBind(`cn=${uid},${config.baseUserDN}`, password);
    return true;
  } catch (err) {
    logger.error(err, 'failed to bind');
    return false;
  }
}

async function reconciliate(
  internalUser: User,
  identityUser: ldap.SearchEntryObject,
) {
  if (Array.isArray(identityUser.mail)) {
    const mails: string[] = identityUser.mail;
    internalUser.emails = [...mails];
  } else if (typeof identityUser.mail === 'string') {
    const mail: string = identityUser.mail;
    internalUser.emails = [mail];
  }
  await internalUser.save();
}
