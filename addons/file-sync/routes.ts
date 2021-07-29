import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import DataDrive from '@ioc:DataDrive';

import { File } from './Models/File';

Route.get(
  '/file-content',
  async ({ request, response, auth }: HttpContextContract) => {
    // Validates that is already authenticated
    const isAuth = await auth.check();
    if (!isAuth) {
      return response.internalServerError({ errors: ['Not authorized'] });
    }

    // Checks that the path is valid
    const id: string = request.all().id.trim();
    if (!id) {
      return response.internalServerError({ errors: ['Id not specified'] });
    }

    // Query file content
    const file = await File.findOrFail(id);
    const content = DataDrive.drive('local').getStream(file);

    response.header(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    return response.stream(content);
  },
);
