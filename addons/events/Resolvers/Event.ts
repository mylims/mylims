import { GqlResolvers } from 'App/graphql';

import { Event } from '../Models/Event';

const resolvers: GqlResolvers = {
  Query: {
    async eventsByTopic(_, { topic }) {
      return Event.query({ topic: topic }).all();
    },
  },
};

export default resolvers;
