import type { Filter } from 'mongodb';

import { ModelAttributes } from '@ioc:Zakodium/Mongodb/Odm';

import {
  GqlQueryEventsArgs,
  GqlEventStatus,
  GqlEventDataType,
} from 'App/graphql';

import { Event } from '../Models/Event';

export default function filteredEvents(
  filterBy: GqlQueryEventsArgs['filterBy'],
) {
  const { topic, processorId, status = [], fileId } = filterBy || {};

  let query: Filter<ModelAttributes<Event>> = {};

  if (processorId) {
    query.processors = { $elemMatch: { processorId } };
  }
  if (status && status.length !== 0) {
    query.$or = [
      { processors: { $elemMatch: { 'history.0.status': { $in: status } } } },
    ];

    if (status.includes(GqlEventStatus.PENDING)) {
      query.$or?.push({ processors: { $size: 0 } });
      query.$or?.push({ processors: { history: { $size: 0 } } });
    }
  }

  if (topic) query.topic = topic;
  if (fileId) {
    query['data.fileId'] = fileId;
    query['data.type'] = GqlEventDataType.FILE;
  }

  return Event.query(query);
}
