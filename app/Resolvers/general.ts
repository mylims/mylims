import { Event } from 'Addons/events/Models/Event';

import { BaseMeasurement } from 'App/Models/Measurement/Base';
import { Sample } from 'App/Models/Sample';
import User from 'App/Models/User';
import { GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

type NodesList = Event | BaseMeasurement | GqlSyncFileRevision | Sample | User;

function isEvent(event: NodesList): event is Event {
  return (event as Event).topic !== undefined;
}
function isSample(sample: NodesList): sample is Sample {
  return (sample as Sample).sampleCode !== undefined;
}
function isUser(user: NodesList): user is User {
  return (user as User).usernames !== undefined;
}
function isMeasurement(measurement: NodesList): measurement is BaseMeasurement {
  return (measurement as BaseMeasurement).eventId !== undefined;
}
const resolvers: GqlResolvers = {
  PaginationNode: {
    __resolveType(obj) {
      if (isEvent(obj)) return 'Event';
      if (isSample(obj)) return 'Sample';
      if (isUser(obj)) return 'User';
      if (isMeasurement(obj)) return 'Measurement';
      const { __typename: type } = obj;
      if (!type) throw new Error("__typename doesn't exist");
      return type;
    },
  },
};

export default resolvers;
