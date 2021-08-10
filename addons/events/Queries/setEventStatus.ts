import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { Event, EventStatus } from '../Models/Event';

export default async function setEventStatus(
  eventId: string,
  processorId: string,
  status: string,
  message: string | undefined,
): Promise<Event> {
  const event = await Event.findOrFail(new ObjectId(eventId));
  const eventProcessor = event.processors.find(
    (p) => p.processorId === processorId,
  );

  const newHistory = {
    status: status as EventStatus,
    date: new Date(),
    message,
  };

  // Validates that the processor exists in the event
  if (!eventProcessor) {
    event.processors.push({
      processorId,
      history: [newHistory],
    });
  } else {
    // Validates that the status is valid
    if (
      eventProcessor.history.length !== 0 ||
      eventProcessor.history[0].status !== EventStatus.PENDING
    ) {
      throw new Error(`Event processor ${processorId} is not pending`);
    }

    eventProcessor.history.unshift(newHistory);
  }
  await event.save();
  return event;
}
