import * as ldap from 'ldapjs';

import { GenericAuthProvider } from '@ioc:Zakodium/Auth';

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
  private userClient: ldap.Client;
  private config: LdapProviderConfig;

  public constructor() {
    this.config = authConfig.providers.ldap as LdapProviderConfig;
    this.userClient = ldap.createClient({ url: this.config.url });
  }

  public async attempt(uid: string, password: string): Promise<any | null> {
    const potentialUser = await User.findOne({ emails: uid });
    if (potentialUser === null) return null;
    console.log(`internal user exists: ${!!potentialUser}`);

    const ldapCN = potentialUser.authMethods.ldap;
    console.log(`ldap identifier: ${ldapCN}`);

    if (ldapCN) {
      const result = await new Promise((resolve) => {
        this.userClient.bind(
          `cn=${ldapCN},${this.config.baseUserDN}`,
          password,
          (err) => resolve(!err),
        );
      });
      console.log(`bind result: ${result}`);
      if (result === true) {
        return ldapCN;
      }
    }
    return null;
  }
}
