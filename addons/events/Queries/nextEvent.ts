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
