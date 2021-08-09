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
          'history.0': {
            $or: [{ status: EventStatus.PENDING }, { $exist: false }],
          },
        },
      },
    },
    {
      driverOptions: { sort: { _id: -1 } },
    },
  ).firstOrFail();
}
