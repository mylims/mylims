import { BaseModel, field, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

enum EventStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

enum EventDataType {
  FILE = 'file',
}

interface EventProcessor {
  processorId: string;
  history: EventHistory[];
}

interface EventHistory {
  status: EventStatus;
  date: Date;
  emitter?: string;
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
