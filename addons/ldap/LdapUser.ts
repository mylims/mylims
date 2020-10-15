import * as ldap from 'ldapjs';

import { ProviderUserContract } from '@ioc:Adonis/Addons/Auth';

import User from 'App/Models/User';

import { LdapProviderConfig } from './LdapAuthProvider';

/**
 * LDAP user works a bridge between the provider and the guard
 */
export default class LdapUser implements ProviderUserContract<User> {
  private userClient: ldap.Client;

  public constructor(public user: User, public config: LdapProviderConfig) {
    this.userClient = ldap.createClient({ url: this.config.url });
  }

  /**
   * Returns the value of the user id
   */
  public getId(): string | null {
    const { ldap } = this.user.auth;
    return ldap || null;
  }

  /**
   * Verifies the user password
   */
  public verifyPassword(_plainPassword: string) {
    const { ldap } = this.user.auth;
    if (!ldap) return Promise.reject(new Error("user doesn't have LDAP"));
    return new Promise<boolean>((resolve) => {
      this.userClient.bind(
        `cn=${ldap},${this.config.baseUserDN}`,
        _plainPassword,
        (err) => resolve(!err),
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
  public setRememberMeToken(/* _token: string */): void {
    throw new Error('Method not implemented.');
  }
}
