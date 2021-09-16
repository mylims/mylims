import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlEventDataType, GqlEventStatus } from 'App/graphql';

export enum EventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface EventProcessor {
  processorId: string;
  history: EventHistory[];
}

interface EventHistory {
  processId: string;
  status: GqlEventStatus;
  date: Date;
  message?: string;
}

interface EventData {
  type: GqlEventDataType.FILE;
  fileId: string;
}

export class Event extends BaseModel {
  @field()
  public _id: ObjectId;
  public topic: string;
  public data: EventData;
  public processors: EventProcessor[];
}
