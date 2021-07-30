import Event, { EventStatus } from '../Models/Event';

export default async function nextEvent(
  processorId: string,
  topic: string,
): Promise<Event> {
  return Event.query(
    {
      topic,
      processors: {
        $elemMatch: {
          processorId,
          history: {
            $or: [
              { $elemMatch: { status: EventStatus.PENDING } },
              { $size: 0 },
            ],
          },
        },
      },
    },
    {
      driverOptions: { sort: { _id: -1 } },
    },
  ).firstOrFail();
}
