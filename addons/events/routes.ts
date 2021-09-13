import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import freeEvent from './Queries/freeEvent';
import nextEvent from './Queries/nextEvent';
import setEventStatus from './Queries/setEventStatus';
import NextEventValidator from './Validators/NextEventValidator';
import SetEventValidator from './Validators/SetEventValidator';

Route.group(() => {
  Route.get(
    '/free-event',
    async ({ request, response }: HttpContextContract) => {
      // Checks that the params are valid
      const params = await request.validate(NextEventValidator);

      // Gets the next event
      const event = await freeEvent(params);
      return response.json(event);
    },
  );

  Route.post(
    '/next-event',
    async ({ request, response }: HttpContextContract) => {
      // Checks that the params are valid
      const params = await request.validate(NextEventValidator);

      // Gets the next event
      const event = await nextEvent(params);
      return response.json(event);
    },
  );

  Route.put(
    '/set-event',
    async ({ request, response }: HttpContextContract) => {
      // Checks that the params are valid
      const params = await request.validate(SetEventValidator);

      // Gets the next event
      const event = await setEventStatus(params);
      return response.json(event);
    },
  );
}).middleware('auth');
