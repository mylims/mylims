
import { UserProviderContract, ProviderUserContract } from '@ioc:Adonis/Addons/Auth'
import { IocContract, inject } from '@adonisjs/fold'

import * as ldap from 'ldapjs'

@inject([null, null])
export class LDAPUser implements ProviderUserContract<any>{
  private userClient = ldap.createClient({ url: 'ldap://127.0.0.1:1389' })

  constructor (public user: any, public config: LDAPProviderConfig){}

  public getId (): string | number | null {
    return this.user[this.config.uid] as string
  }
  public verifyPassword (_plainPassword: string) {
    return new Promise<boolean>(resolve => {
      this.userClient.bind(`cn=${this.user[this.config.uid]},${this.config.baseUserDN}`, _plainPassword, err => {
        resolve(err ? false : true)
      })
    })
  }
  public getRememberMeToken (): string | null {
    return null
  }
  public setRememberMeToken (): void {}
}

export class LDAPAuthProvider implements UserProviderContract<LDAPUser> {
  private adminClient = ldap.createClient({ url: 'ldap://127.0.0.1:1389' })
  private adminBound = false

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
    return new Promise(resolve => {
      this._adminBind(err => {
        if(err) {
          return resolve(undefined)
        }

        this.adminClient.search(this.config.baseUserDN, {
          filter: `(${this.config.uid}=*${id}*)`,
          scope: 'sub',
        }, (err, res) => {
          if(err) {
            return resolve(undefined)
          }
          const foundEntries: ldap.SearchEntryObject[] = []
          res.on('searchEntry', entry => {
            foundEntries.push(entry.object)
          })
          res.on('end', () => {
            resolve(this.getUserFor(foundEntries[0]))
          })
        })
      })
    })
  }

  public findByUid (id: string): Promise<ProviderUserContract<LDAPUser>> {
    return this.findById(id)
  }
  public findByRememberMeToken (_userId: string | number, _token: string): Promise<ProviderUserContract<LDAPUser>> {
    throw new Error('Method not implemented.')
  }
  public updateRememberMeToken (_authenticatable: ProviderUserContract<LDAPUser>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  private _adminBind (callback: (err?: Error) => void) {
    if(this.adminBound === true) {
      return callback()
    }

    this.adminClient.bind(this.config.appDN, this.config.appPassword, (err) => {
      if(err) {
        this.adminBound = false
        return callback(err)
      }

      this.adminBound = true
      callback()
    })
  }
}

export interface LDAPProviderConfig {
  driver: 'ldap'
  appDN: string
  appPassword: string
  baseUserDN: string
  uid: string
}
