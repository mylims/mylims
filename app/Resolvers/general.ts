import { Event } from 'Addons/events/Models/Event';

import { GqlMeasurement, GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

function isEvent(
  event: Event | GqlMeasurement | GqlSyncFileRevision,
): event is Event {
  return (event as Event).topic !== undefined;
}

const resolvers: GqlResolvers = {
  PaginationNode: {
    __resolveType: (obj) => {
      if (isEvent(obj)) return 'Event';
      const { __typename: type } = obj;
      if (!type) throw new Error("__typename doesn't exist");
      return type;
    },
  },
};

export default resolvers;
