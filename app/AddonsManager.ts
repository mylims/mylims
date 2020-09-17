import * as fs from 'fs'
import * as path from 'path'

export default class AddonsManager {
  private static base = path.resolve(path.join('.'))

  private constructor () {}

  public static getAddons () {
    return fs.readdirSync(path.join(AddonsManager.base, 'addons'))
  }

  private static getRoutesFiles () {
    return AddonsManager.getAddons()
      .map(addon => path.join(AddonsManager.base, 'addons', addon, 'routes'))
      .filter(routeFile => fs.existsSync(routeFile))
  }

  public static registerRoutes () {
    AddonsManager.getRoutesFiles().map(require)
  }

  public static getMigrations () {
    return AddonsManager.getAddons()
      .filter((addon) => fs.existsSync(path.join(AddonsManager.base, 'addons', addon, 'migrations')))
      .map((addon) => path.join('addons', addon, 'migrations'))
  }
}
