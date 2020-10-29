/* eslint-disable @typescript-eslint/unbound-method */
import { promisify } from 'util';

import * as ldap from 'ldapjs';

import logger from '@ioc:Adonis/Core/Logger';
import { GenericAuthProvider } from '@ioc:Zakodium/Auth';
import UserManager from '@ioc:Zakodium/User';

import User from 'App/Models/User';

import authConfig from '../../config/auth';

export interface LdapProviderConfig {
  driver: 'ldap';
  appDN: string;
  appPassword: string;
  baseUserDN: string;
  uid: string;
  id: string;
  url: string;
}

export default class LocalAuthProvider implements GenericAuthProvider {
  private adminClient: ldap.Client;
  private userClient: ldap.Client;
  private adminBound = false;
  private config: LdapProviderConfig;

  public constructor() {
    this.config = authConfig.providers.ldap as LdapProviderConfig;
    this.userClient = ldap.createClient({ url: this.config.url });
    this.adminClient = ldap.createClient({ url: this.config.url });
  }

  public async attempt(uid: string, password: string): Promise<User | null> {
    await this.bind();
    try {
      const ldapEntry = await this.searchUser(uid);
      if (ldapEntry !== null && (await this.checkPassword(uid, password))) {
        const internalUser = await UserManager.getUser(
          'ldap',
          ldapEntry[this.config.id],
        );
        if (Array.isArray(ldapEntry.mail)) {
          const mails: string[] = ldapEntry.mail;
          internalUser.emails = [...mails];
        } else if (typeof ldapEntry.mail === 'string') {
          const mail: string = ldapEntry.mail;
          internalUser.emails = [mail];
        }
        await internalUser.save();
        return internalUser;
      }
      return null;
    } catch (err) {
      logger.error('failed to search');
      return null;
    }
  }

  private async bind() {
    const adminBind = promisify<string, string>(this.adminClient.bind).bind(
      this.adminClient,
    );

    if (this.adminBound) return true;
    try {
      await adminBind(this.config.appDN, this.config.appPassword);
      this.adminBound = true;
      return true;
    } catch (err) {
      logger.error('ldap failed to bind as admin', err);
      return false;
    }
  }
  private async searchUser(
    uid: string,
  ): Promise<ldap.SearchEntryObject | null> {
    const ldapSearch = promisify<
      string,
      ldap.SearchOptions,
      ldap.SearchCallbackResponse
    >(this.adminClient.search).bind(this.adminClient);

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
          return resolve(foundEntries[0] as string);
        } else {
          return resolve(null);
        }
      });
    });
  }
  private async checkPassword(uid: string, password: string) {
    const clientBind = promisify<string, string, void>(
      this.userClient.bind,
    ).bind(this.userClient);
    try {
      await clientBind(`cn=${uid},${this.config.baseUserDN}`, password);
      return true;
    } catch (err) {
      logger.error('failed to check password', err);
      return false;
    }
  }
}
