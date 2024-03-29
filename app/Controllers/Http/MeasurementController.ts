import { Event } from 'Addons/events/Models/Event';
import { SyncFile } from 'Addons/file-sync/Models/SyncFile';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DataDrive from '@ioc:Zakodium/DataDrive';
import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { MeasurementParams } from 'App/Models/Measurement/Base';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import { Sample } from 'App/Models/Sample';
import User from 'App/Models/User';
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
      const {
        file,
        collection,
        sampleCode,
        derived,
        description: comment,
        username,
      } = params;
      const eventId = new ObjectId(params.eventId);
      const sampleCodeList = sampleCode.split(',');

      // Create the file
      let fileId: string | undefined;
      if (file) {
        const filename =
          file.fileName ?? (await this._filenameByEvent(eventId));
        const localFile = await this.drive.moveFromMultipart(file, filename);
        const dbFile = await File.create({
          _id: localFile.id,
          collection,
          size: localFile.size,
          filename: localFile.filename,
        });
        fileId = dbFile._id;
      }

      // Create user relationship
      const user = await this._getUser(username);
      const userId = user._id;
      const sample = await this._getSample(sampleCodeList, userId);

      // Create the measurement
      const derivedJson = derived ? this._deepParse(derived) : undefined;
      const measurement = await this._createMeasurement(
        collection,
        {
          username,
          eventId,
          fileId,
          comment,
          sampleId: sample._id,
          createdBy: userId,
        },
        derivedJson,
      );

      // Add activity to the sample
      if (fileId) {
        sample.attachments.push({ id: fileId, date: new Date() });
      }
      sample.measurements.push({
        id: measurement._id,
        type: collection,
        date: new Date(),
      });
      await sample.save();

      return response.ok(measurement);
    } catch (error) {
      return response.badRequest(error.messages ?? [error.message]);
    }
  }

  // ---------------------------------------------------------------------------

  private async _filenameByEvent(eventId: ObjectId): Promise<string> {
    const event = await Event.findOrFail(eventId);
    const file = await SyncFile.findByOrFail(
      'revisions.0.id',
      event.data.fileId,
    );
    return file.filename;
  }

  private async _getUser(username: string): Promise<User> {
    const cursor = User.query({ usernames: username });
    const length = await cursor.count();
    if (length === 0) {
      throw new Error(`User ${username} not found`);
    } else if (length === 1) {
      return cursor.firstOrFail();
    } else {
      throw new Error('Multiple users with same username');
    }
  }

  private async _getSample(
    sampleCode: string[],
    userId: ObjectId,
  ): Promise<Sample> {
    const cursor = Sample.query({ sampleCode, userId });
    const length = await cursor.count();
    if (length === 0) {
      throw new Error(`Missing sample ${sampleCode.join('_')}`);
    } else if (length === 1) {
      return cursor.firstOrFail();
    } else {
      throw new Error('Multiple samples with same code');
    }
  }

  private async _createMeasurement(
    collection: string,
    rest: MeasurementParams,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    derived?: any,
  ) {
    const measurement = { ...rest, derived };

    switch (collection) {
      case 'transfer': {
        return TransferMeasurement.create(measurement);
      }
      default: {
        throw new Error(`Unknown measurement collection ${collection}`);
      }
    }
  }

  private _deepParse(str: string) {
    const object = JSON.parse(str);
    for (const key in object) {
      object[key] = JSON.parse(object[key]);
    }
    return object;
  }
}
