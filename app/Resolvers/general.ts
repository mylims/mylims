import { Event } from 'Addons/events/Models/Event';

import { Sample } from 'App/Models/Sample';
import User from 'App/Models/User';
import { GqlMeasurement, GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

type NodesList = Event | GqlMeasurement | GqlSyncFileRevision | Sample | User;

function isEvent(event: NodesList): event is Event {
  return (event as Event).topic !== undefined;
}
function isSample(sample: NodesList): sample is Sample {
  return (sample as Sample).sampleCode !== undefined;
}
function isUser(user: NodesList): user is User {
  return (user as User).usernames !== undefined;
}
const resolvers: GqlResolvers = {
  PaginationNode: {
    __resolveType(obj) {
      if (isEvent(obj)) return 'Event';
      if (isSample(obj)) return 'Sample';
      if (isUser(obj)) return 'User';
      const { __typename: type } = obj;
      if (!type) throw new Error("__typename doesn't exist");
      return type;
    },
  },
};

export default resolvers;
