import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';
import DataDrive from '@ioc:Zakodium/DataDrive';

import { File } from './Models/File';

async function fetchFile({ request, response }: HttpContextContract) {
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
}

Route.group(() => {
  Route.get('/file-content', fetchFile);
  Route.post('/file-content', fetchFile);
}).middleware('auth');
