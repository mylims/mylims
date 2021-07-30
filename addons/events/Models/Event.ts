import { BaseModel, field } from '@ioc:Zakodium/Mongodb/Odm';

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

export default class Event extends BaseModel {
  @field()
  public _id: EventId;
  public history: EventHistory[];
}
