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

export default class LdapAuthProvider {
  private config: LdapProviderConfig;

  public constructor() {
    this.config = getConfig('ldap');
  }

  public async attempt(uid: string, password: string): Promise<User | null> {
    const userClient = ldap.createClient({ url: this.config.url });
    // bad password or bind failed
    if ((await this.bind(userClient, uid, password)) === false) return null;
    try {
      const ldapEntry = await this.searchUser(userClient, uid);
      if (ldapEntry !== null) {
        const id = ldapEntry[this.config.id];
        const internalUser = await UserManager.getUser(
          'ldap',
          Array.isArray(id) ? id[0] : id,
          Array.isArray(ldapEntry.mail) ? ldapEntry.mail[0] : ldapEntry.mail,
        );
        await this.reconciliate(internalUser, ldapEntry);
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

  private async searchUser(
    userClient: ldap.Client,
    uid: string,
  ): Promise<ldap.SearchEntryObject | null> {
    const ldapSearch = promisify<
      string,
      ldap.SearchOptions,
      ldap.SearchCallbackResponse
    >(userClient.search.bind(userClient));

    const response = await ldapSearch(this.config.baseUserDN, {
      filter: `(${this.config.uid}=*${uid}*)`,
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

  private async bind(userClient: ldap.Client, uid: string, password: string) {
    const clientBind = promisify<string, string, void>(
      userClient.bind.bind(userClient),
    );
    try {
      await clientBind(`cn=${uid},${this.config.baseUserDN}`, password);
      return true;
    } catch (err) {
      logger.error(err, 'failed to bind');
      return false;
    }
  }

  private async reconciliate(
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
}
