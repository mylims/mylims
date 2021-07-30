import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Route from '@ioc:Adonis/Core/Route';

import nextEvent from './Queries/nextEvent';
import setEventStatus from './Queries/setEventStatus';

Route.get(
  '/next-event',
  async ({ request, response, auth }: HttpContextContract) => {
    // Validates that is already authenticated
    const isAuth = await auth.check();
    if (!isAuth) {
      return response.internalServerError({ errors: ['Not authorized'] });
    }

    // Checks that the params are valid
    const params: Record<string, string | undefined> = request.all();
    if (!params.processorId) {
      return response.internalServerError({
        errors: ['Processor not specified'],
      });
    }
    if (!params.topic) {
      return response.internalServerError({
        errors: ['Topic not specified'],
      });
    }

    // Gets the next event
    const event = await nextEvent(params.processorId, params.topic);
    return response.json(event);
  },
);

Route.put(
  '/set-event',
  async ({ request, response, auth }: HttpContextContract) => {
    // Validates that is already authenticated
    const isAuth = await auth.check();
    if (!isAuth) {
      return response.internalServerError({ errors: ['Not authorized'] });
    }

    // Checks that the params are valid
    const params: Record<string, string | undefined> = request.all();
    if (!params.eventId) {
      return response.internalServerError({
        errors: ['Event not specified'],
      });
    }
    if (!params.processorId) {
      return response.internalServerError({
        errors: ['Processor not specified'],
      });
    }
    if (!params.status) {
      return response.internalServerError({
        errors: ['Status not specified'],
      });
    }

    // Gets the next event
    const event = await setEventStatus(
      params.eventId,
      params.processorId,
      params.status,
      params.message,
    );
    return response.json(event);
  },
);
