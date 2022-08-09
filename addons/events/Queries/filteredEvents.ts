import type { Filter } from 'mongodb';

import type { ModelAttributes } from '@ioc:Zakodium/Mongodb/Odm';

import {
  GqlQueryEventsArgs,
  GqlEventStatus,
  GqlEventDataType,
} from 'App/graphql';
import { filterDate, filterText, NotReadOnly } from 'App/utils';

import { Event } from '../Models/Event';

export default function filteredEvents(
  filterBy: GqlQueryEventsArgs['filterBy'],
) {
  const { topic, processorId, status = [], fileId, createdAt } = filterBy || {};

  let query: Filter<NotReadOnly<ModelAttributes<Event>>> = {};

  if (processorId) {
    query.processors = { $elemMatch: { processorId: filterText(processorId) } };
  }

  if (status && status.length !== 0) {
    query.$or = [
      { processors: { $elemMatch: { 'history.0.status': { $in: status } } } },
    ];

    // If the status is pending, is possible that processors are empty
    if (status.includes(GqlEventStatus.PENDING)) {
      query.$or?.push({ processors: { $size: 0 } });
      query.$or?.push({ processors: { history: { $size: 0 } } });
    }
  }

  if (topic) query.topic = filterText(topic);
  if (createdAt) query.createdAt = filterDate(createdAt);
  if (fileId) {
    query['data.fileId'] = fileId;
    query['data.type'] = GqlEventDataType.FILE;
  }

  return Event.query(query);
}
