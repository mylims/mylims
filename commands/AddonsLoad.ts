import { BaseCommand } from '@adonisjs/ace'
import { RcFile } from '@ioc:Adonis/Core/Application'

import * as fs from 'fs/promises'
import * as path from 'path'

export default class AddonsLoad extends BaseCommand {
  public static commandName = 'addons:load'
  public static description = 'Load addons and register providers.'

  public async handle () {
    this.logger.info('Loading addons')

    const addons = await fs.readdir('addons')
    this.logger.info(`Found ${addons.length} addons`)

    await this.registerProviders(addons).catch(err => this.logger.error(`Error while registering addons providers : ${err}`))

    this.logger.success('Successfully loaded addons.')
  }

  private async registerProviders (addons: string[]) {
    const rcFile = await fs.readFile('.adonisrc.json', { encoding: 'utf-8'})
    const rc: RcFile = JSON.parse(rcFile)
    await Promise.all(
      addons.map(async addon => {
        (await fs.readdir(path.join('addons', addon, 'providers')))
          .filter(fileName => path.extname(fileName) === '.ts')
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
    this.logger.success('Registered addons providers')
  }
}
