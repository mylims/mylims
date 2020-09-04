import { IocContract } from '@adonisjs/fold'
import { AuthManagerContract } from '@ioc:Adonis/Addons/Auth'
import { LDAPAuthProvider } from '../LDAPAuthProvider'

export default class LDAPProvider {
  constructor (protected container: IocContract) {
  }

  public register () {

  }

  public boot () {
    // IoC container is ready
    this.container.with(['Adonis/Addons/Auth'], (Auth: AuthManagerContract) => {
      Auth.extend('provider', 'ldap', (container, config) => new LDAPAuthProvider(container, config))
    })
  }

  public shutdown () {
    // Cleanup, since app is going down
  }

  public ready () {
    // App is ready
  }
}
