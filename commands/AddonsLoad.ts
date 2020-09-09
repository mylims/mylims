import { BaseCommand } from '@adonisjs/ace'
import { RcFile } from '@ioc:Adonis/Core/Application'

import * as fs from 'fs/promises'
import * as path from 'path'

export default class AddonsLoad extends BaseCommand {
  public static commandName = 'addons:load'
  public static description = 'Load addons and register providers.'

  public async handle () {
    this.logger.info('Loading addons')
    const addonsPath = this.application.makePath('addons')

    const addons = await fs.readdir(addonsPath)
    this.logger.info(`Found ${addons.length} addons`)

    const rcFile = await fs.readFile('.adonisrc.json', { encoding: 'utf8'})
    const rc: RcFile = JSON.parse(rcFile)

    this.logger.info('Editing RC file')
    await Promise.all(
      addons.map(async addon => {
        (await fs.readdir(path.join(addonsPath, addon, 'providers')))
          .filter(fileName => path.extname(fileName) === '.js')
          .map(fileName => fileName.substr(0, fileName.length - path.extname(fileName).length))
          .forEach(providerName => {
            const toAdd = `./addons/${addon}/providers/${providerName}`
            if (rc.providers.includes(toAdd) === false) {
              rc.providers.push(toAdd)
            }
          })
      })
    )

    await fs.writeFile('.adonisrc.json', JSON.stringify(rc, null, 2))

    this.logger.success('Successfully loaded addons.')
  }
}
