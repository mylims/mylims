import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlEventDataType, GqlEventStatus } from 'App/graphql';

export enum EventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface EventProcessor {
  /** Internal processor identifier (send by the processor) */
  processorId: string;
  /** List of interactions from processors */
  history: EventHistory[];
}

interface EventHistory {
  processId: string;
  status: GqlEventStatus;
  date: Date;
  /** Mainly used on errors notification */
  message?: string;
}

interface EventData {
  type: GqlEventDataType.FILE;
  fileId: string;
}

/**
 * @property topic - The name of the specific pipeline or topic to be listened to.
 * @property data - The data to that is sent when the processor request the event.
 * @property processors - The list of interactions grouped by the processor id.
 */
export class Event extends BaseModel {
  @field()
  public _id: ObjectId;
  public topic: string;
  public data: EventData;
  public processors: EventProcessor[];
}
