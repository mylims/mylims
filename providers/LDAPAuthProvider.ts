
import { UserProviderContract, ProviderUserContract } from '@ioc:Adonis/Addons/Auth'
import { IocContract, inject } from '@adonisjs/fold'

import * as ldap from 'ldapjs'
import { HashContract } from '@ioc:Adonis/Core/Hash'

@inject([null, null, 'Adonis/Core/Hash'])
export class LDAPUser implements ProviderUserContract<any>{
  constructor (public user: any, public config: LDAPProviderConfig, private hash: HashContract){}

  public getId (): string | number | null {
    return this.user[this.config.uid] as string
  }
  public async verifyPassword (plainPassword: string) {
    return this.user.userPassword === plainPassword
  }
  public getRememberMeToken (): string | null {
    return null
  }
  public setRememberMeToken (token: string): void {}
}

export class LDAPAuthProvider implements UserProviderContract<LDAPUser> {
  private ldapClient = ldap.createClient({ url: 'ldap://127.0.0.1:1389'})
  private container: IocContract<ldap.SearchEntryObject>
  private config: LDAPProviderConfig

  constructor (container: IocContract, config: LDAPProviderConfig) {
    this.container = container
    this.config = config
  }

  public getUserFor (user: any): ProviderUserContract<any> {
    return this.container.make(LDAPUser, [user, this.config])
  }
  public findById (id: string | number): Promise<ProviderUserContract<LDAPUser>> {
    throw new Error('Method not implemented.')
  }
  public findByUid (id: string): Promise<ProviderUserContract<LDAPUser>> {
    return new Promise((resolve, reject) => {
      this.ldapClient.search(this.config.baseDN, {
        filter: `(${this.config.uid}=*${id}*)`,
        scope: 'sub',
      }, (err, res) => {
        if(err) {
          reject(err)
        }

        const entries: ldap.SearchEntryObject[] = []

        res.on('searchEntry', entry => {
          entries.push(entry.object)
        })

        res.on('error', err => {
          reject(err)
        })

        res.on('end', () => {
          resolve(this.getUserFor(entries[0]))
        })
      })
    })
  }
  public findByRememberMeToken (_userId: string | number, _token: string): Promise<ProviderUserContract<LDAPUser>> {
    throw new Error('Method not implemented.')
  }
  public updateRememberMeToken (_authenticatable: ProviderUserContract<LDAPUser>): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export interface LDAPProviderConfig {
  driver: 'ldap'
  baseDN: string,
  uid: string
}
