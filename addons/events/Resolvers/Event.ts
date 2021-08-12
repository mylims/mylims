import { GqlResolvers } from 'App/graphql';

import { Event, EventDataType } from '../Models/Event';

const resolvers: GqlResolvers = {
  Query: {
    async eventsByTopic(_, { topic }) {
      return Event.query({ topic }).all();
    },
    async eventsByFileId(_, { fileId }) {
      return Event.query({
        'data.type': EventDataType.FILE,
        'data.fileId': fileId,
      }).all();
    },
  },
};

export default resolvers;
