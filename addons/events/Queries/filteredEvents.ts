import type { Filter } from 'mongodb';

import { ModelAttributes } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlQueryEventsArgs, GqlEventStatus } from 'App/graphql';

import { Event } from '../Models/Event';

export default async function filteredEvents(
  filterBy: GqlQueryEventsArgs['filterBy'],
) {
  const {
    topic,
    processorId,
    status = [GqlEventStatus.PENDING],
  } = filterBy || {};

  let query: Filter<ModelAttributes<Event>> = {
    processors: {
      $elemMatch: {
        'history.0.status': { $in: status },
        processorId: processorId || { $exists: true },
      },
    },
  };
  if (topic) query.topic = topic;

  return (await Event.getCollection()).find(query);
}
