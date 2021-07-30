import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

export enum EventStatus {
  PENDING = 'pending',
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
  status: EventStatus;
  date: Date;
  message?: string;
}

interface EventData {
  type: EventDataType.FILE;
  fileId: string;
}

export default class Event extends BaseModel {
  @field()
  public _id: ObjectId;
  public topic: string;
  public data: EventData;
  public processors: EventProcessor[];
}
