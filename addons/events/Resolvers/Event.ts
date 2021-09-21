import {
  GqlEventDataType,
  GqlEventSortField,
  GqlResolvers,
  GqlSortDirection,
} from 'App/graphql';

import { SyncFile } from '../../file-sync/Models/SyncFile';
import filteredEvents from '../Queries/filteredEvents';

const sortMap = {
  [GqlEventSortField.DATE]: 'processors.0.history.0.date',
  [GqlEventSortField.TOPIC]: 'topic',
  [GqlEventSortField.CREATEDAT]: 'createdAt',
  [GqlEventSortField.PROCESSORID]: 'processors.0.processorId',
  [GqlEventSortField.STATUS]: 'processors.0.history.0.status',
};
const resolvers: GqlResolvers = {
  EventData: {
    __resolveType(obj) {
      switch (obj.type) {
        case GqlEventDataType.FILE: {
          return 'EventDataFile';
        }
        default: {
          return null;
        }
      }
    },
  },
  EventDataFile: {
    async file({ fileId }) {
      const file = await SyncFile.findByOrFail('revisions.0.id', fileId);
      return {
        id: fileId,
        name: file._id.relativePath,
      };
    },
  },
  Query: {
    async events(_, { limit, skip, filterBy, sortBy }) {
      const {
        field = GqlEventSortField.DATE,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      let eventCursor = filteredEvents(filterBy).sortBy(
        sortMap[field],
        direction === GqlSortDirection.DESC ? -1 : 1,
      );
      const totalCount = await eventCursor.count();
      if (skip) eventCursor = eventCursor.skip(skip);
      if (limit) eventCursor = eventCursor.limit(limit);

      const events = (await eventCursor.all()).map(
        ({ _id, topic, data, createdAt, processors }) => ({
          id: _id.toHexString(),
          topic,
          data,
          createdAt,
          processors,
        }),
      );
      return { events, totalCount };
    },
  },
};

export default resolvers;
