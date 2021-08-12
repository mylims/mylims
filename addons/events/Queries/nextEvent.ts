import { Event, EventStatus } from '../Models/Event';

interface NextEventParams {
  processorId: string;
  topic: string;
}
export default async function nextEvent({
  processorId,
  topic,
}: NextEventParams): Promise<Event> {
  return Event.query({
    topic,
    processors: {
      $elemMatch: {
        processorId,
        'history.0': {
          $or: [{ status: EventStatus.PENDING }, { $exist: false }],
        },
      },
    },
  }).firstOrFail();
}
