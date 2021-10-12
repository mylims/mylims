import { randomUUID } from 'crypto';

import { Event } from 'Addons/events/Models/Event';
import { SyncFile } from 'Addons/file-sync/Models/SyncFile';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DataDrive from '@ioc:Zakodium/DataDrive';
import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { MeasurementParams } from 'App/Models/Measurement/Base';
import { GeneralMeasurement } from 'App/Models/Measurement/General';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import MeasurementValidator from 'App/Validators/MeasurementValidator';

export default class MeasurementController {
  private drive = DataDrive.use('files');

  public async fetch({ request, response }: HttpContextContract) {
    const id = request.param('id', null);
    if (id === null) {
      return response.badRequest({ errors: ['Missing field id'] });
    }
    const file = await File.find(id);
    if (file === null) {
      return response.notFound({ errors: [{ message: 'File not found' }] });
    }

    const content = await this.drive.getStream(file);
    response.header(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    return response.stream(content);
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const params = await request.validate(MeasurementValidator);
      const { eventId, file, collection, ...restParams } = params;

      // Create the file
      let fileId: string | undefined;
      if (file) {
        const filename =
          file.fileName ?? (await this._filenameByEvent(params.eventId));
        const localFile = await this.drive.moveFromMultipart(file, filename);
        const dbFile = await File.create({
          _id: randomUUID(),
          collection,
          size: localFile.size,
          filename: localFile.filename,
        });
        fileId = dbFile._id;
      }

      // Create the measurement
      const measurement = await this._createMeasurement(collection, {
        ...restParams,
        eventId,
        fileId,
      });

      return response.ok(measurement);
    } catch (error) {
      return response.badRequest({ errors: [error] });
    }
  }

  private async _filenameByEvent(eventId: string): Promise<string> {
    const event = await Event.findOrFail(new ObjectId(eventId));
    const file = await SyncFile.findByOrFail(
      'revisions.0.id',
      event.data.fileId,
    );
    return file.filename;
  }

  private async _createMeasurement(
    collection: string,
    rest: MeasurementParams,
  ) {
    const derived = rest.derived ? JSON.parse(rest.derived) : undefined;
    const meta = rest.meta ? JSON.parse(rest.meta) : undefined;
    const measurement = { ...rest, derived, meta };

    switch (collection) {
      case 'transfer': {
        return TransferMeasurement.create(measurement);
      }
      default: {
        return GeneralMeasurement.create({ ...measurement, collection });
      }
    }
  }
}
