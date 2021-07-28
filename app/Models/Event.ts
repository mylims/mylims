import { Model } from '@ioc:Mongodb/Model';

import { GqlEventStatus } from 'App/graphql';

interface EventId {
  topic: string;
  id: number;
}

interface EventHistory {
  status: GqlEventStatus;
  date: Date;
  emitter?: string;
}

export default class User extends Model<EventId> {
  public history: EventHistory[];
}
