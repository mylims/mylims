import { promisify } from 'util';

import { BaseCommand, flags } from '@adonisjs/core/build/standalone';
import { v4 as uuid } from '@lukeed/uuid';
import { toJcamp } from 'common-spectrum';
import { fromB1505 } from 'iv-spectrum';

import type DataDrive from '@ioc:DataDrive';

import { Event, EventDataType, EventStatus } from '../../events/Models/Event';
import nextEvent from '../../events/Queries/nextEvent';
import setEventStatus from '../../events/Queries/setEventStatus';
import { File } from '../../file-sync/Models/File';

const asyncTimeout = promisify(setTimeout);

export default class Processor extends BaseCommand {
  public static commandName = 'processor:jcamp';

  public static description = 'Processor for Jcamp files';

  @flags.string({ description: 'Processor id' })
  public processorId: string;

  @flags.number({ description: 'Timeout in seconds' })
  public interval: number;

  public static settings = {
    loadApp: true,
  };

  private deps: {
    Event: typeof Event;
    File: typeof File;
    DataDrive: typeof DataDrive;
    nextEvent: typeof nextEvent;
    setEventStatus: typeof setEventStatus;
  };

  private topic = 'b1505';

  public async run() {
    const { Event } = await import('../../events/Models/Event');
    const { default: nextEvent } = await import(
      '../../events/Queries/nextEvent'
    );
    const { default: setEventStatus } = await import(
      '../../events/Queries/setEventStatus'
    );
    const { File } = await import('../../file-sync/Models/File');
    const { default: DataDrive } = await import('@ioc:DataDrive');

    this.deps = {
      Event,
      File,
      DataDrive,
      nextEvent,
      setEventStatus,
    };

    if (this.interval !== undefined) {
      while (true) {
        await this.executeProcessor();
        await this.wait();
      }
    } else {
      await this.executeProcessor();
    }
  }

  private async wait() {
    this.logger.info(`Waiting ${this.interval} seconds...`);
    await asyncTimeout(this.interval * 1000);
  }

  private async executeProcessor() {
    let event: Event | undefined;
    try {
      // Separate next available event
      const { id } = await this.deps.nextEvent({
        processorId: this.processorId,
        topic: this.topic,
      });
      event = await this.deps.setEventStatus({
        eventId: id.toHexString(),
        status: EventStatus.PENDING,
        processorId: this.processorId,
      });
    } catch (error) {
      this.logger.error(error, this.processorId);
    }

    if (event) {
      try {
        const drive = this.deps.DataDrive.drive('local');

        if (event.data.type === EventDataType.FILE) {
          // Process file
          const { fileId } = event.data;
          const file = await this.deps.File.findOrFail(fileId);
          const content = await drive.get(file);

          const analyses = fromB1505(content);
          const jcamp = analyses.map((val) => toJcamp(val)).join('\n');

          const filename = `${file.filename}.jdx`;
          const id = uuid();
          const driveFile = await drive.put(filename, jcamp, {
            id,
          });
          await this.deps.File.create({
            _id: id,
            filename: driveFile.filename,
            size: driveFile.size,
          });

          // Set event status to done
          await this.deps.setEventStatus({
            eventId: event.id.toHexString(),
            status: EventStatus.SUCCESS,
            processorId: this.processorId,
          });
        }
      } catch (error) {
        // Defines the error for the event
        await this.deps.setEventStatus({
          eventId: event.id.toHexString(),
          status: EventStatus.ERROR,
          processorId: this.processorId,
        });
        this.logger.error(error, this.processorId);
      }
    }
  }
}
