import { randomUUID } from 'crypto';

import { Event, EventStatus } from '../Models/Event';

import freeEvent from './freeEvent';
import setEventStatus from './setEventStatus';

interface NextEventParams {
  processorId: string;
  topic: string;
}
export default async function nextEvent(
  eventParams: NextEventParams,
): Promise<Event> {
  const event = await freeEvent(eventParams);
  return setEventStatus({
    eventId: event.id.toHexString(),
    processId: randomUUID(),
    processorId: eventParams.processorId,
    status: EventStatus.PROCESSING,
  });
}
