import { Event } from 'Addons/events/Models/Event';

import { Sample } from 'App/Models/Sample';
import { GqlMeasurement, GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

function isEvent(
  event: Event | GqlMeasurement | GqlSyncFileRevision | Sample,
): event is Event {
  return (event as Event).topic !== undefined;
}
function isSample(
  sample: Event | GqlMeasurement | GqlSyncFileRevision | Sample,
): sample is Sample {
  return (sample as Sample).sampleCode !== undefined;
}
const resolvers: GqlResolvers = {
  PaginationNode: {
    __resolveType: (obj) => {
      if (isEvent(obj)) return 'Event';
      if (isSample(obj)) return 'Sample';
      const { __typename: type } = obj;
      if (!type) throw new Error("__typename doesn't exist");
      return type;
    },
  },
};

export default resolvers;
