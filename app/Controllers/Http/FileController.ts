import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DataDrive from '@ioc:Zakodium/DataDrive';

import File from 'App/Models/File';
import SlateImage from 'App/Models/SlateImage';
import SampleValidator from 'App/Validators/FileValidator';

export default class SampleController {
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

  public async fetchImage({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid', null);
    if (uuid === null) {
      return response.badRequest({ errors: ['Missing field uuid'] });
    }
    const file = await SlateImage.findBy('_id', uuid);
    if (file === null) {
      return response.notFound({ errors: [{ message: 'File not found' }] });
    }

    const content = await this.drive.getStream(file);
    return response.stream(content);
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const { file, collection } = await request.validate(SampleValidator);

      // Create the file
      const localFile = await this.drive.moveFromMultipart(
        file,
        file.fileName || file.clientName,
      );
      const dbFile = await File.create({
        _id: localFile.id,
        size: localFile.size,
        filename: localFile.filename,
        collection,
      });

      return response.ok(dbFile);
    } catch (error) {
      return response.badRequest({ errors: [error] });
    }
  }
}
