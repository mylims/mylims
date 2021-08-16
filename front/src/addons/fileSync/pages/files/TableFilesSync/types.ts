import type {
  EventStatus,
  FilesByConfigQuery,
  FileStatus,
} from '../../../generated/graphql';

export interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
  id: string;
  loading: boolean;
}

export enum TreeType {
  file = 'file',
  dir = 'dir',
}
export interface SyncBase {
  id: string;
  name: string;
  size: number;
  date: Date;
  path: string[];
  expanded: boolean;
}
export interface FileSync extends SyncBase {
  type: TreeType.file;
  relativePath: string;
  countRevisions: number;
  status: FileStatus;
  downloadUrl: string;
}
export interface DirSync extends SyncBase {
  type: TreeType.dir;
  children: TreeSync[] | null;
}
export type TreeSync = FileSync | DirSync;

export interface TreeContextType {
  state: TreeSync[];
  setState: (state: TreeSync[]) => void;
  id: string;
}

export interface EventsProcessors {
  topic: string;
  processorId: string;
  status: EventStatus;
  date: Date;
}
