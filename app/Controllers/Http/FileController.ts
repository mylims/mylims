import { createReadStream } from 'fs';

import type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import DataDrive, { PutOptions } from '@ioc:Zakodium/DataDrive';

import File from 'App/Models/File';
import CreateFileValidator from 'App/Validators/CreateFileValidator';

export default class FileController {
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
      const params = await request.validate(CreateFileValidator);
      const file = await this.moveFromMultipart(params.file, params.filename);
      const createdFile = await File.create({
        _id: file.id,
        filename: file.filename,
        size: file.size,
        eventId: params.eventId,
        sampleId: params.sampleId,
      });
      return response.ok(createdFile);
    } catch (error) {
      return response.badRequest({ errors: [error] });
    }
  }

  private async moveFromMultipart(
    file: MultipartFileContract,
    filename: string,
    options?: PutOptions,
  ) {
    const { tmpPath } = file;
    if (!tmpPath) throw new Error('File path is missing');

    return this.drive.putStream(filename, createReadStream(tmpPath), options);
  }
}
