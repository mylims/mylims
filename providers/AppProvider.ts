import { IocContract } from '@adonisjs/fold'

export default class AppProvider {
  constructor (protected container: IocContract) {
  }

  public register () {

  }

  public boot () {
    // IoC container is ready
  }

  public shutdown () {
    // Cleanup, since app is going down
  }

  public ready () {
    // App is ready
  }
}
