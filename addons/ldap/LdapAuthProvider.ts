import * as ldap from 'ldapjs';

import {
  UserProviderContract,
  ProviderUserContract,
} from '@ioc:Adonis/Addons/Auth';
import { IocContract } from '@ioc:Adonis/Core/Application';
import UserManager from '@ioc:Zakodium/User';

import User from 'App/Models/User';

import LdapUser from './LdapUser';

export interface LdapProviderConfig {
  driver: 'ldap';
  appDN: string;
  appPassword: string;
  baseUserDN: string;
  uid: string;
  id: string;
  url: string;
}

/**
 * Database provider to lookup users inside the LDAP
 */
export default class LdapAuthProvider implements UserProviderContract<User> {
  private adminClient: ldap.Client;
  private adminBound = false;

  public constructor(
    private container: IocContract<ldap.SearchEntryObject>,
    private config: LdapProviderConfig,
    private UserManager: UserManager,
  ) {
    this.adminClient = ldap.createClient({ url: this.config.url });
  }

  /**
   * Returns an instance of provider user
   */
  public getUserFor(user: User | null) {
    return this.container.make(LdapUser, [user, this.config]);
  }

  /**
   * Returns the user row using the primary key
   */
  public findById(id: string): Promise<ProviderUserContract<User>> {
    return new Promise((resolve) => {
      this._adminBind((err) => {
        if (err) {
          return resolve(undefined);
        }

        this.adminClient.search(
          this.config.baseUserDN,
          {
            filter: `(${this.config.id}=*${id}*)`,
            scope: 'sub',
          },
          (err, res) => {
            if (err) {
              return resolve(undefined);
            }
            const foundEntries: ldap.SearchEntryObject[] = [];
            res.on('searchEntry', (entry) => {
              foundEntries.push(entry.object);
            });
            res.on('end', () => {
              if (foundEntries.length > 0) {
                this.UserManager.getUser('ldap', id)
                  .then((user) => resolve(this.getUserFor(user)))
                  .catch((err) => {
                    throw err;
                  });
              } else {
                resolve(undefined);
              }
            });
          },
        );
      });
    });
  }

  /**
   * Returns the user row by searching the uidValue against
   * their defined uids.
   */
  public findByUid(uid: string): Promise<ProviderUserContract<User>> {
    return new Promise((resolve, reject) => {
      this._adminBind((err) => {
        if (err) return reject(err);

        this.adminClient.search(
          this.config.baseUserDN,
          {
            filter: `(${this.config.uid}=*${uid}*)`,
            scope: 'sub',
          },
          (err, res) => {
            if (err) return reject(err);

            const foundEntries: ldap.SearchEntryObject[] = [];
            res.on('searchEntry', (entry) => {
              foundEntries.push(entry.object);
            });

            res.on('end', () => {
              if (foundEntries.length > 0) {
                this.UserManager.getUser(
                  'ldap',
                  foundEntries[0][this.config.id] as string,
                )
                  .then((user) => resolve(this.getUserFor(user)))
                  .catch((err) => reject(err));
              } else {
                resolve(this.getUserFor(null));
              }
            });
          },
        );
      });
    });
  }

  /**
   * Returns a user from their remember me token
   */
  public findByRememberMeToken(/*_userId: string | number, _token: string,*/): Promise<
    ProviderUserContract<User>
  > {
    throw new Error('Method not implemented.');
  }

  /**
   * Updates the user remember me token
   */
  public updateRememberMeToken(/* _authenticatable: ProviderUserContract<User> */): Promise<
    void
  > {
    throw new Error('Method not implemented.');
  }

  private _adminBind(callback: (err?: Error) => void) {
    if (this.adminBound === true) {
      return callback();
    }

    this.adminClient.bind(this.config.appDN, this.config.appPassword, (err) => {
      if (err) {
        this.adminBound = false;
        return callback(err);
      }

      this.adminBound = true;
      callback();
    });
  }
}
