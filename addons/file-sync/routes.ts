import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import DataDrive from '@ioc:Zakodium/DataDrive';

import { File } from './Models/File';

Route.get(
  '/file-content',
  async ({ request, response }: HttpContextContract) => {
    // Checks that the path is valid
    const id: string = request.all().id.trim();
    if (!id) {
      return response.internalServerError({ errors: ['Id not specified'] });
    }

    // Query file content
    const file = await File.findOrFail(id);
    const content = await DataDrive.use('local').getStream(file);

    response.header(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    return response.stream(content);
  },
).middleware('auth');
