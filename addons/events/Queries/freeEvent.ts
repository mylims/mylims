import { Event, EventStatus } from '../Models/Event';

interface NextEventParams {
  processorId: string;
  topic: string;
}

/**
 * Search for events that match the topic and the processor availability
 *
 * @param props.processorId - The processor identifier to search on.
 * @param props.topic - Topic to search on.
 * @returns - An event untouched or a pending event from the same processor.
 */
export default async function freeEvent({
  processorId,
  topic,
}: NextEventParams): Promise<Event> {
  return Event.query({
    topic,
    $or: [
      { processors: { $size: 0 } },
      {
        processors: {
          $elemMatch: {
            processorId,
            $or: [
              { history: { $size: 0 } },
              { 'history.0.status': EventStatus.PENDING },
            ],
          },
        },
      },
    ],
  }).firstOrFail();
}
