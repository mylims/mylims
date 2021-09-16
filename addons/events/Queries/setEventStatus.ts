import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlEventStatus } from 'App/graphql';

import { Event } from '../Models/Event';

interface SetEventStatusParams {
  eventId: string;
  processId: string;
  processorId: string;
  status: string;
  message?: string;
}
export default async function setEventStatus({
  eventId,
  processId,
  processorId,
  status,
  message,
}: SetEventStatusParams): Promise<Event> {
  const event = await Event.findOrFail(new ObjectId(eventId));
  const eventProcessor = event.processors.find(
    (p) => p.processorId === processorId,
  );

  const newHistory = {
    processId,
    status: status as GqlEventStatus,
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
    const previousStatus = eventProcessor.history[0]?.status;

    switch (status as GqlEventStatus) {
      case GqlEventStatus.PENDING: {
        if (eventProcessor.history.length === 0) {
          eventProcessor.history.unshift(newHistory);
        } else if (previousStatus === GqlEventStatus.PENDING) {
          // add event before the previous processId
          const latestIndex = eventProcessor.history.findIndex(
            (p) => p.processId === processId,
          );
          if (latestIndex > 0) {
            eventProcessor.history.splice(latestIndex, 0, newHistory);
          } else {
            throw new Error(
              `Event processor ${processId} doesn't have a processId ${processId}`,
            );
          }
        } else {
          throw new Error(
            `Event processor ${processId} previous status is ${previousStatus}`,
          );
        }
        break;
      }
      case GqlEventStatus.PROCESSING: {
        if (previousStatus === GqlEventStatus.PENDING) {
          eventProcessor.history.unshift(newHistory);
        } else {
          throw new Error(
            `Event processor ${processId} previous status is ${previousStatus}`,
          );
        }
        break;
      }
      case GqlEventStatus.SUCCESS:
      case GqlEventStatus.ERROR: {
        eventProcessor.history.unshift(newHistory);
        break;
      }
      default: {
        throw new Error(`Event processor ${processId} status is invalid`);
      }
    }
  }
  await event.save();
  return event;
}
