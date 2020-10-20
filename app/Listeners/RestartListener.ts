import { EventsList } from '@ioc:Adonis/Core/Event';
import logger from '@ioc:Adonis/Core/Logger';

export default class RestartListener {
  public async handleRestart(reason: EventsList['mylims:restart']) {
    if (process.send) {
      logger.info(`${reason}, restarting...`);
      process.send('restart');
    } else {
      throw new Error('trying to restart outside a child process');
    }
  }
}
