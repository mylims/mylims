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
        eventId,
        file,
        collection,
        sampleCode,
        sampleKind,
        ...restParams
      } = params;
      const sampleCodeList = sampleCode.split(',');

      // Create the file
      let fileId: string | undefined;
      if (file) {
        const filename =
          file.fileName ?? (await this._filenameByEvent(params.eventId));
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
      const user = await this._getOrCreateUser(restParams.username);
      const userId = user._id.toHexString();
      const sample = await this._getOrCreateSample(
        userId,
        sampleCodeList,
        sampleKind,
      );

      // Create the measurement
      const measurement = await this._createMeasurement(collection, {
        ...restParams,
        eventId,
        fileId,
        sampleCode: sampleCodeList,
        createdBy: userId,
      });

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
      return response.badRequest({ errors: [error] });
    }
  }

  // ---------------------------------------------------------------------------

  private async _filenameByEvent(eventId: string): Promise<string> {
    const event = await Event.findOrFail(new ObjectId(eventId));
    const file = await SyncFile.findByOrFail(
      'revisions.0.id',
      event.data.fileId,
    );
    return file.filename;
  }

  private async _getOrCreateUser(username: string): Promise<User> {
    const cursor = User.query({ usernames: { $elemMatch: { $eq: username } } });
    const length = await cursor.count();
    if (length === 0) {
      return User.create({
        usernames: [username],
        role: 'MEMBER',
        emails: [],
        authMethods: {},
      });
    } else if (length === 1) {
      return cursor.firstOrFail();
    } else {
      throw new Error('Multiple users with same username');
    }
  }

  private async _getOrCreateSample(
    userId: string,
    sampleCode: string[],
    kind: string,
  ): Promise<Sample> {
    const cursor = Sample.query({ userId: new ObjectId(userId), sampleCode });
    const length = await cursor.count();
    if (length === 0) {
      return Sample.fromInput(new Sample(), {
        userId,
        sampleCode,
        kind,
        labels: [],
        meta: {},
      });
    } else if (length === 1) {
      return cursor.firstOrFail();
    } else {
      throw new Error('Multiple samples with same code');
    }
  }

  private async _createMeasurement(
    collection: string,
    rest: MeasurementParams,
  ) {
    const derived = rest.derived ? this._deepParse(rest.derived) : undefined;
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
