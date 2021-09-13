import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export enum EventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum EventDataType {
  FILE = 'file',
}

interface EventProcessor {
  processorId: string;
  history: EventHistory[];
}

interface EventHistory {
  processId: string;
  status: EventStatus;
  date: Date;
  message?: string;
}

interface EventData {
  type: EventDataType.FILE;
  fileId: string;
}

export class Event extends BaseModel {
  @field()
  public _id: ObjectId;
  public topic: string;
  public data: EventData;
  public processors: EventProcessor[];
}
