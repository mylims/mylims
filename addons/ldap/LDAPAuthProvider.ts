import { IocContract, inject } from '@adonisjs/fold';
import * as ldap from 'ldapjs';
import { UserManager } from 'providers/user/UserManager';
import { UserBuilder } from 'providers/user/UserModel';

import {
  UserProviderContract,
  ProviderUserContract,
} from '@ioc:Adonis/Addons/Auth';

type MongoUser = InstanceType<ReturnType<typeof UserBuilder>>;

/**
 * LDAP user works a bridge between the provider and the guard
 */
@inject([null, null])
export class LDAPUser implements ProviderUserContract<MongoUser> {
  private userClient: ldap.Client;

  public constructor(
    public user: MongoUser,
    public config: LDAPProviderConfig,
  ) {
    this.userClient = ldap.createClient({ url: this.config.url });
    this.user = user;
  }

  /**
   * Returns the value of the user id
   */
  public getId(): string | null {
    if (this.user === null || this.user['ldap_auth'] === null) {
      return null;
    }
    return this.user['ldap_auth'] as string;
  }

  /**
   * Verifies the user password
   */
  public verifyPassword(_plainPassword: string) {
    console.log('verifyPassword');
    return new Promise<boolean>((resolve) => {
      this.userClient.bind(
        `cn=${this.user['ldap_auth']},${this.config.baseUserDN}`,
        _plainPassword,
        (err) => {
          resolve(err ? false : true);
        },
      );
    });
  }

  /**
   * Returns the user remember me token or null
   */
  public getRememberMeToken(): string | null {
    return null;
  }

  /**
   * Updates user remember me token
   */
  public setRememberMeToken(_token: string): void {
    throw new Error('Method not implemented.');
  }
}

/**
 * Database provider to lookup users inside the LDAP
 */
export class LDAPAuthProvider implements UserProviderContract<MongoUser> {
  private adminClient: ldap.Client;
  private adminBound = false;

  private container: IocContract<ldap.SearchEntryObject>;
  private config: LDAPProviderConfig;

  public constructor(
    container: IocContract,
    config: LDAPProviderConfig,
    private UserManager: UserManager,
  ) {
    this.container = container;
    this.config = config;
    this.adminClient = ldap.createClient({ url: this.config.url });
  }

  /**
   * Returns an instance of provider user
   */
  public getUserFor(user: InstanceType<ReturnType<typeof UserBuilder>>) {
    console.log('getUserFor');
    return this.container.make(LDAPUser, [user, this.config]);
  }

  /**
   * Returns the user row using the primary key
   */
  public findById(id: string): Promise<ProviderUserContract<MongoUser>> {
    console.log('findById');
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
  public findByUid(uid: string): Promise<ProviderUserContract<MongoUser>> {
    console.log('findByUid');
    return new Promise((resolve) => {
      this._adminBind((err) => {
        if (err) {
          return resolve(undefined);
        }

        this.adminClient.search(
          this.config.baseUserDN,
          {
            filter: `(${this.config.uid}=*${uid}*)`,
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
              console.log(foundEntries.length);
              if (foundEntries.length > 0) {
                this.UserManager.getUser(
                  'ldap',
                  foundEntries[0][this.config.id] as string,
                )
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
   * Returns a user from their remember me token
   */
  public findByRememberMeToken(
    _userId: string | number,
    _token: string,
  ): Promise<ProviderUserContract<MongoUser>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Updates the user remember me token
   */
  public updateRememberMeToken(
    _authenticatable: ProviderUserContract<MongoUser>,
  ): Promise<void> {
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

export interface LDAPProviderConfig {
  driver: 'ldap';
  appDN: string;
  appPassword: string;
  baseUserDN: string;
  uid: string;
  id: string;
  url: string;
}
