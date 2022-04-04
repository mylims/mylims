import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type DeleteFileSyncOptionInput = {
  id: Scalars['ID'];
};

export type DirectoryEntry = {
  path: Scalars['String'];
  type: DirectoryEntryType;
};

export enum DirectoryEntryType {
  DIRECTORY = 'directory',
  FILE = 'file',
}

export type EditFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
  readyChecks: Array<ReadyCheckInput>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type Event = {
  createdAt: Scalars['DateTime'];
  data: EventData;
  id: Scalars['ID'];
  processors: Array<EventProcessor>;
  topic: Scalars['String'];
};

export type EventData = {
  type: EventDataType;
};

export type EventDataFile = EventData & {
  file: EventFile;
  fileId: Scalars['String'];
  type: EventDataType;
};

export enum EventDataType {
  FILE = 'file',
}

export type EventFile = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type EventFilterInput = {
  createdAt?: InputMaybe<FilterDate>;
  fileId?: InputMaybe<Scalars['String']>;
  processorId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<EventStatus>>;
  topic?: InputMaybe<FilterText>;
};

export type EventHistory = {
  date: Scalars['DateTime'];
  message?: Maybe<Scalars['String']>;
  processId: Scalars['String'];
  status: EventStatus;
};

export type EventPage = Pagination & {
  list: Array<Event>;
  totalCount: Scalars['Int'];
};

export type EventProcessor = {
  history: Array<EventHistory>;
  processorId: Scalars['String'];
};

export enum EventSortField {
  CREATEDAT = 'createdAt',
  DATE = 'date',
  PROCESSORID = 'processorId',
  STATUS = 'status',
  TOPIC = 'topic',
}

export type EventSortInput = {
  direction: SortDirection;
  field: EventSortField;
};

export enum EventStatus {
  ERROR = 'error',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
}

export type FileContent = {
  content: Scalars['String'];
  filename: Scalars['String'];
  size: Scalars['Int'];
};

export enum FileStatus {
  IMPORT_FAIL = 'import_fail',
  IMPORTED = 'imported',
  IMPORTING = 'importing',
  PENDING = 'pending',
}

export type FileSyncOption = {
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  maxDepth: Scalars['Int'];
  patterns: Array<Pattern>;
  readyChecks: Array<ReadyCheck>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type FileSyncOptionPatternInput = {
  pattern: Scalars['String'];
  type: PatternType;
};

export type FilesFilterInput = {
  date?: InputMaybe<FilterDate>;
  filename?: InputMaybe<FilterText>;
  size?: InputMaybe<FilterNumber>;
  status?: InputMaybe<Array<FileStatus>>;
};

export type FilesFlatPage = Pagination & {
  list: Array<SyncFileRevision>;
  totalCount: Scalars['Int'];
};

export enum FilesSortField {
  DATE = 'date',
  FILENAME = 'filename',
  SIZE = 'size',
}

export type FilesSortInput = {
  direction: SortDirection;
  field: FilesSortField;
};

export type FilterDate = {
  from?: InputMaybe<Scalars['DateTime']>;
  to?: InputMaybe<Scalars['DateTime']>;
};

export type FilterList = {
  index?: InputMaybe<Scalars['Int']>;
  value: FilterText;
};

export type FilterMetaText = {
  key: Scalars['String'];
  operator: FilterTextOperator;
  value: Scalars['String'];
};

export type FilterNumber = {
  max?: InputMaybe<Scalars['Int']>;
  min?: InputMaybe<Scalars['Int']>;
};

export type FilterText = {
  operator: FilterTextOperator;
  value: Scalars['String'];
};

export enum FilterTextOperator {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  STARTSWITH = 'startsWith',
}

export type Measurement = {
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<Scalars['String']>;
  derived?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['JSON']>;
  eventId?: Maybe<Scalars['String']>;
  file?: Maybe<MeasurementFile>;
  fileId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  sample: Sample;
  title?: Maybe<Scalars['String']>;
  type: MeasurementTypes;
  user?: Maybe<User>;
  username: Scalars['String'];
};

export type MeasurementFile = {
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  size: Scalars['Int'];
};

export type MeasurementFilterInput = {
  createdAt?: InputMaybe<FilterDate>;
  sampleCode?: InputMaybe<Array<FilterList>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MeasurementInput = {
  comment?: InputMaybe<Scalars['String']>;
  derived?: InputMaybe<Scalars['JSON']>;
  description?: InputMaybe<Scalars['JSON']>;
  eventId?: InputMaybe<Scalars['String']>;
  fileId?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type MeasurementPage = Pagination & {
  list: Array<Measurement>;
  totalCount: Scalars['Int'];
};

export enum MeasurementSortField {
  CREATEDAT = 'createdAt',
  CREATEDBY = 'createdBy',
  USERNAME = 'username',
}

export type MeasurementSortInput = {
  direction: SortDirection;
  field: MeasurementSortField;
};

export enum MeasurementTypes {
  TRANSFER = 'transfer',
}

export type Mutation = {
  createFileSyncOption: FileSyncOption;
  createMeasurement: Measurement;
  createSample: Sample;
  createSampleKind: SampleKind;
  createSamples: Array<Sample>;
  deleteFileSyncOption: Array<FileSyncOption>;
  editFileSyncOption: FileSyncOption;
  updateSample: Sample;
  updateSampleKind: SampleKind;
};

export type MutationCreateFileSyncOptionArgs = {
  input: NewFileSyncOptionInput;
};

export type MutationCreateMeasurementArgs = {
  input: MeasurementInput;
  sampleId: Scalars['String'];
  type: MeasurementTypes;
};

export type MutationCreateSampleArgs = {
  input: SampleInput;
};

export type MutationCreateSampleKindArgs = {
  input: SampleKindInput;
};

export type MutationCreateSamplesArgs = {
  samples: Array<SampleInput>;
};

export type MutationDeleteFileSyncOptionArgs = {
  input: DeleteFileSyncOptionInput;
};

export type MutationEditFileSyncOptionArgs = {
  input: EditFileSyncOptionInput;
};

export type MutationUpdateSampleArgs = {
  id: Scalars['ID'];
  input: SampleInput;
};

export type MutationUpdateSampleKindArgs = {
  id: Scalars['ID'];
  input: SampleKindInput;
};

export type NewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
  readyChecks: Array<ReadyCheckInput>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type Pagination = {
  list: Array<PaginationNode>;
  totalCount: Scalars['Int'];
};

export type PaginationNode =
  | Event
  | Measurement
  | Sample
  | SyncFileRevision
  | User;

export type Pattern = {
  pattern: Scalars['String'];
  type: PatternType;
};

export enum PatternType {
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export type Query = {
  directoryTree: Array<DirectoryEntry>;
  event: Event;
  events: EventPage;
  fileByPath: FileContent;
  fileSyncOption: FileSyncOption;
  fileSyncOptions: Array<FileSyncOption>;
  filesByConfig: SyncTreeRevision;
  filesByConfigFlat: FilesFlatPage;
  measurement: Measurement;
  measurements: MeasurementPage;
  readyChecks: Array<ReadyCheckDescriptor>;
  sample: Sample;
  sampleKind: SampleKind;
  samples: SamplePage;
  users: Array<User>;
  usersInput: UserPage;
};

export type QueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type QueryEventArgs = {
  id: Scalars['ID'];
};

export type QueryEventsArgs = {
  filterBy?: InputMaybe<EventFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<EventSortInput>;
};

export type QueryFileByPathArgs = {
  path: Scalars['String'];
};

export type QueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type QueryFilesByConfigArgs = {
  configId: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  path: Array<Scalars['String']>;
};

export type QueryFilesByConfigFlatArgs = {
  filterBy?: InputMaybe<FilesFilterInput>;
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<FilesSortInput>;
};

export type QueryMeasurementArgs = {
  id: Scalars['ID'];
  type: MeasurementTypes;
};

export type QueryMeasurementsArgs = {
  filterBy?: InputMaybe<MeasurementFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<MeasurementSortInput>;
  type: MeasurementTypes;
};

export type QuerySampleArgs = {
  id: Scalars['ID'];
};

export type QuerySampleKindArgs = {
  id: Scalars['ID'];
};

export type QuerySamplesArgs = {
  filterBy?: InputMaybe<SampleFilterInput>;
  kind: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SampleSortInput>;
};

export type QueryUsersInputArgs = {
  input: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type ReadyCheck = {
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ReadyCheckDescriptor = {
  hasArg: Scalars['Boolean'];
  name: Scalars['String'];
};

export type ReadyCheckInput = {
  name: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
};

export type Sample = {
  attachments: Array<SampleFile>;
  children?: Maybe<Array<Sample>>;
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  kind: SampleKind;
  labels: Array<Scalars['String']>;
  measurements: Array<Measurement>;
  meta: Scalars['JSON'];
  parent?: Maybe<Sample>;
  project?: Maybe<Scalars['String']>;
  sampleCode: Array<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  uuid10: Scalars['String'];
};

export type SampleFile = {
  collection?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  size: Scalars['Int'];
};

export type SampleFilterInput = {
  comment?: InputMaybe<FilterText>;
  createdAt?: InputMaybe<FilterDate>;
  labels?: InputMaybe<FilterText>;
  meta?: InputMaybe<Array<FilterMetaText>>;
  project?: InputMaybe<FilterText>;
  sampleCode?: InputMaybe<Array<FilterList>>;
  title?: InputMaybe<FilterText>;
  userId?: InputMaybe<Scalars['String']>;
};

export type SampleInput = {
  attachments: Array<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSON']>;
  kind: Scalars['String'];
  labels: Array<Scalars['String']>;
  meta: Scalars['JSON'];
  parent?: InputMaybe<Scalars['String']>;
  project?: InputMaybe<Scalars['String']>;
  sampleCode: Array<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type SampleKind = {
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  schema: Scalars['JSON'];
};

export type SampleKindInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  schema: Scalars['JSON'];
};

export type SamplePage = Pagination & {
  kind: SampleKind;
  list: Array<Sample>;
  totalCount: Scalars['Int'];
};

export enum SampleSortField {
  CREATEDAT = 'createdAt',
  CREATEDBY = 'createdBy',
  USERNAME = 'username',
}

export type SampleSortInput = {
  direction: SortDirection;
  field: SampleSortField;
};

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SyncDirRevision = SyncElementRevision & {
  date: Scalars['DateTime'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
};

export type SyncElementRevision = {
  date: Scalars['DateTime'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
};

export type SyncFileRevision = SyncElementRevision & {
  countRevisions: Scalars['Int'];
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
  status: FileStatus;
};

export type SyncTreeRevision = {
  _id: Scalars['String'];
  dirs: Array<SyncDirRevision>;
  files: Array<SyncFileRevision>;
  ignoredFiles: Scalars['Int'];
};

export type User = {
  authMethods: Scalars['JSONObject'];
  emails: Array<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  role: Scalars['String'];
  usernames: Array<Scalars['String']>;
};

export type UserPage = Pagination & {
  list: Array<User>;
  totalCount: Scalars['Int'];
};

export type EventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type EventQuery = {
  event: {
    id: string;
    topic: string;
    createdAt: any;
    data: { file: { id: string; name: string } };
    processors: Array<{
      processorId: string;
      history: Array<{
        processId: string;
        status: EventStatus;
        date: any;
        message?: string | null;
      }>;
    }>;
  };
};

export type EventsFilteredQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  filterBy?: InputMaybe<EventFilterInput>;
  sortBy?: InputMaybe<EventSortInput>;
}>;

export type EventsFilteredQuery = {
  events: {
    totalCount: number;
    list: Array<{
      id: string;
      topic: string;
      createdAt: any;
      data: { file: { id: string; name: string } };
      processors: Array<{
        processorId: string;
        history: Array<{
          status: EventStatus;
          date: any;
          message?: string | null;
        }>;
      }>;
    }>;
  };
};

export type DirectoryTreeQueryVariables = Exact<{
  root: Scalars['String'];
}>;

export type DirectoryTreeQuery = {
  directoryTree: Array<{ path: string; type: DirectoryEntryType }>;
};

export type FileSyncOptionFieldsFragment = {
  id: string;
  enabled: boolean;
  root: string;
  maxDepth: number;
  topics: Array<string>;
  patterns: Array<{ type: PatternType; pattern: string }>;
  readyChecks: Array<{ name: string; value?: string | null }>;
};

export type FileSyncOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type FileSyncOptionsQuery = {
  fileSyncOptions: Array<{
    id: string;
    enabled: boolean;
    root: string;
    maxDepth: number;
    topics: Array<string>;
    patterns: Array<{ type: PatternType; pattern: string }>;
    readyChecks: Array<{ name: string; value?: string | null }>;
  }>;
};

export type FileSyncOptionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type FileSyncOptionQuery = {
  fileSyncOption: {
    id: string;
    enabled: boolean;
    root: string;
    maxDepth: number;
    topics: Array<string>;
    patterns: Array<{ type: PatternType; pattern: string }>;
    readyChecks: Array<{ name: string; value?: string | null }>;
  };
};

export type CreateFileSyncOptionMutationVariables = Exact<{
  input: NewFileSyncOptionInput;
}>;

export type CreateFileSyncOptionMutation = {
  createFileSyncOption: {
    id: string;
    enabled: boolean;
    root: string;
    maxDepth: number;
    topics: Array<string>;
    patterns: Array<{ type: PatternType; pattern: string }>;
    readyChecks: Array<{ name: string; value?: string | null }>;
  };
};

export type EditFileSyncOptionMutationVariables = Exact<{
  input: EditFileSyncOptionInput;
}>;

export type EditFileSyncOptionMutation = {
  editFileSyncOption: {
    id: string;
    enabled: boolean;
    root: string;
    maxDepth: number;
    topics: Array<string>;
    patterns: Array<{ type: PatternType; pattern: string }>;
    readyChecks: Array<{ name: string; value?: string | null }>;
  };
};

export type DeleteFileSyncOptionMutationVariables = Exact<{
  input: DeleteFileSyncOptionInput;
}>;

export type DeleteFileSyncOptionMutation = {
  deleteFileSyncOption: Array<{
    id: string;
    enabled: boolean;
    root: string;
    maxDepth: number;
    topics: Array<string>;
    patterns: Array<{ type: PatternType; pattern: string }>;
    readyChecks: Array<{ name: string; value?: string | null }>;
  }>;
};

type RevisionFields_SyncDirRevision_Fragment = {
  id: string;
  size: number;
  relativePath: string;
  date: any;
  path: Array<string>;
};

type RevisionFields_SyncFileRevision_Fragment = {
  id: string;
  size: number;
  relativePath: string;
  date: any;
  path: Array<string>;
};

export type RevisionFieldsFragment =
  | RevisionFields_SyncDirRevision_Fragment
  | RevisionFields_SyncFileRevision_Fragment;

export type FilesByConfigQueryVariables = Exact<{
  id: Scalars['String'];
  path: Array<Scalars['String']> | Scalars['String'];
}>;

export type FilesByConfigQuery = {
  filesByConfig: {
    __typename: 'SyncTreeRevision';
    _id: string;
    ignoredFiles: number;
    files: Array<{
      countRevisions: number;
      status: FileStatus;
      downloadUrl: string;
      filename: string;
      id: string;
      size: number;
      relativePath: string;
      date: any;
      path: Array<string>;
    }>;
    dirs: Array<{
      id: string;
      size: number;
      relativePath: string;
      date: any;
      path: Array<string>;
    }>;
  };
};

export type EventsByFileIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type EventsByFileIdQuery = {
  events: {
    __typename: 'EventPage';
    list: Array<{
      id: string;
      topic: string;
      processors: Array<{
        processorId: string;
        history: Array<{
          status: EventStatus;
          date: any;
          message?: string | null;
        }>;
      }>;
    }>;
  };
};

export type FilesByConfigFlatQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  filterBy?: InputMaybe<FilesFilterInput>;
  sortBy?: InputMaybe<FilesSortInput>;
}>;

export type FilesByConfigFlatQuery = {
  filesByConfigFlat: {
    totalCount: number;
    list: Array<{
      __typename: 'SyncFileRevision';
      id: string;
      filename: string;
      size: number;
      relativePath: string;
      status: FileStatus;
      date: any;
      downloadUrl: string;
    }>;
  };
};

export type ReadyChecksQueryVariables = Exact<{ [key: string]: never }>;

export type ReadyChecksQuery = {
  readyChecks: Array<{ name: string; hasArg: boolean }>;
};

export type MeasurementFieldsFragment = {
  id: string;
  type: MeasurementTypes;
  title?: string | null;
  fileId?: string | null;
  eventId?: string | null;
  comment?: string | null;
  derived?: any | null;
  createdAt: any;
  createdBy?: string | null;
  description?: any | null;
  user?: {
    id: string;
    emails: Array<string>;
    lastName?: string | null;
    firstName?: string | null;
    usernames: Array<string>;
  } | null;
  sample: { id: string; sampleCode: Array<string> };
  file?: { size: number; filename: string; downloadUrl: string } | null;
};

export type MeasurementsFilteredQueryVariables = Exact<{
  type: MeasurementTypes;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  filterBy?: InputMaybe<MeasurementFilterInput>;
  sortBy?: InputMaybe<MeasurementSortInput>;
}>;

export type MeasurementsFilteredQuery = {
  measurements: {
    totalCount: number;
    list: Array<{
      id: string;
      type: MeasurementTypes;
      title?: string | null;
      fileId?: string | null;
      eventId?: string | null;
      comment?: string | null;
      derived?: any | null;
      createdAt: any;
      createdBy?: string | null;
      description?: any | null;
      user?: {
        id: string;
        emails: Array<string>;
        lastName?: string | null;
        firstName?: string | null;
        usernames: Array<string>;
      } | null;
      sample: { id: string; sampleCode: Array<string> };
      file?: { size: number; filename: string; downloadUrl: string } | null;
    }>;
  };
};

export type MeasurementQueryVariables = Exact<{
  id: Scalars['ID'];
  type: MeasurementTypes;
}>;

export type MeasurementQuery = {
  measurement: {
    id: string;
    type: MeasurementTypes;
    title?: string | null;
    fileId?: string | null;
    eventId?: string | null;
    comment?: string | null;
    derived?: any | null;
    createdAt: any;
    createdBy?: string | null;
    description?: any | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
    sample: { id: string; sampleCode: Array<string> };
    file?: { size: number; filename: string; downloadUrl: string } | null;
  };
};

export type CreateMeasurementMutationVariables = Exact<{
  type: MeasurementTypes;
  sampleId: Scalars['String'];
  input: MeasurementInput;
}>;

export type CreateMeasurementMutation = {
  createMeasurement: {
    id: string;
    type: MeasurementTypes;
    title?: string | null;
    fileId?: string | null;
    eventId?: string | null;
    comment?: string | null;
    derived?: any | null;
    createdAt: any;
    createdBy?: string | null;
    description?: any | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
    sample: { id: string; sampleCode: Array<string> };
    file?: { size: number; filename: string; downloadUrl: string } | null;
  };
};

export type SampleFieldsFragment = {
  id: string;
  meta: any;
  title?: string | null;
  uuid10: string;
  labels: Array<string>;
  project?: string | null;
  comment?: string | null;
  createdAt: any;
  sampleCode: Array<string>;
  description?: any | null;
  user?: {
    id: string;
    emails: Array<string>;
    lastName?: string | null;
    firstName?: string | null;
    usernames: Array<string>;
  } | null;
};

export type SampleKindFieldsFragment = {
  id: string;
  name?: string | null;
  color?: string | null;
  schema: any;
  description?: string | null;
};

export type SamplesFilteredQueryVariables = Exact<{
  kind: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  filterBy?: InputMaybe<SampleFilterInput>;
  sortBy?: InputMaybe<SampleSortInput>;
}>;

export type SamplesFilteredQuery = {
  samples: {
    totalCount: number;
    list: Array<{
      id: string;
      meta: any;
      title?: string | null;
      uuid10: string;
      labels: Array<string>;
      project?: string | null;
      comment?: string | null;
      createdAt: any;
      sampleCode: Array<string>;
      description?: any | null;
      children?: Array<{
        id: string;
        meta: any;
        title?: string | null;
        uuid10: string;
        labels: Array<string>;
        project?: string | null;
        comment?: string | null;
        createdAt: any;
        sampleCode: Array<string>;
        description?: any | null;
        user?: {
          id: string;
          emails: Array<string>;
          lastName?: string | null;
          firstName?: string | null;
          usernames: Array<string>;
        } | null;
      }> | null;
      parent?: { id: string } | null;
      user?: {
        id: string;
        emails: Array<string>;
        lastName?: string | null;
        firstName?: string | null;
        usernames: Array<string>;
      } | null;
    }>;
  };
};

export type SampleQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type SampleQuery = {
  sample: {
    __typename: 'Sample';
    id: string;
    meta: any;
    title?: string | null;
    uuid10: string;
    labels: Array<string>;
    project?: string | null;
    comment?: string | null;
    createdAt: any;
    sampleCode: Array<string>;
    description?: any | null;
    attachments: Array<{
      id: string;
      date: any;
      size: number;
      filename: string;
      collection?: string | null;
      downloadUrl: string;
    }>;
    measurements: Array<{
      id: string;
      type: MeasurementTypes;
      title?: string | null;
      createdAt: any;
      description?: any | null;
      file?: { size: number; filename: string; downloadUrl: string } | null;
    }>;
    children?: Array<{
      id: string;
      meta: any;
      title?: string | null;
      uuid10: string;
      labels: Array<string>;
      project?: string | null;
      comment?: string | null;
      createdAt: any;
      sampleCode: Array<string>;
      description?: any | null;
      user?: {
        id: string;
        emails: Array<string>;
        lastName?: string | null;
        firstName?: string | null;
        usernames: Array<string>;
      } | null;
    }> | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
  };
};

export type SampleKindQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type SampleKindQuery = {
  sampleKind: {
    id: string;
    name?: string | null;
    color?: string | null;
    schema: any;
    description?: string | null;
  };
};

export type CreateSampleMutationVariables = Exact<{
  input: SampleInput;
}>;

export type CreateSampleMutation = {
  createSample: {
    id: string;
    meta: any;
    title?: string | null;
    uuid10: string;
    labels: Array<string>;
    project?: string | null;
    comment?: string | null;
    createdAt: any;
    sampleCode: Array<string>;
    description?: any | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
  };
};

export type CreateMultipleSamplesMutationVariables = Exact<{
  samples: Array<SampleInput> | SampleInput;
}>;

export type CreateMultipleSamplesMutation = {
  createSamples: Array<{
    id: string;
    meta: any;
    title?: string | null;
    uuid10: string;
    labels: Array<string>;
    project?: string | null;
    comment?: string | null;
    createdAt: any;
    sampleCode: Array<string>;
    description?: any | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
  }>;
};

export type UpdateSampleMutationVariables = Exact<{
  id: Scalars['ID'];
  input: SampleInput;
}>;

export type UpdateSampleMutation = {
  updateSample: {
    id: string;
    meta: any;
    title?: string | null;
    uuid10: string;
    labels: Array<string>;
    project?: string | null;
    comment?: string | null;
    createdAt: any;
    sampleCode: Array<string>;
    description?: any | null;
    user?: {
      id: string;
      emails: Array<string>;
      lastName?: string | null;
      firstName?: string | null;
      usernames: Array<string>;
    } | null;
  };
};

export type UserFieldsFragment = {
  id: string;
  lastName?: string | null;
  firstName?: string | null;
  emails: Array<string>;
  role: string;
  authMethods: any;
  usernames: Array<string>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  users: Array<{
    id: string;
    lastName?: string | null;
    firstName?: string | null;
    emails: Array<string>;
    role: string;
    authMethods: any;
    usernames: Array<string>;
  }>;
};

export type UsersInputQueryVariables = Exact<{
  input: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
}>;

export type UsersInputQuery = {
  usersInput: {
    totalCount: number;
    list: Array<{
      id: string;
      lastName?: string | null;
      firstName?: string | null;
      emails: Array<string>;
      role: string;
      authMethods: any;
      usernames: Array<string>;
    }>;
  };
};

export const FileSyncOptionFieldsFragmentDoc = gql`
  fragment FileSyncOptionFields on FileSyncOption {
    id
    enabled
    root
    maxDepth
    topics
    patterns {
      type
      pattern
    }
    readyChecks {
      name
      value
    }
  }
`;
export const RevisionFieldsFragmentDoc = gql`
  fragment RevisionFields on SyncElementRevision {
    id
    size
    relativePath
    date
    path
  }
`;
export const MeasurementFieldsFragmentDoc = gql`
  fragment MeasurementFields on Measurement {
    id
    type
    title
    fileId
    eventId
    comment
    derived
    createdAt
    createdBy
    description
    user {
      id
      emails
      lastName
      firstName
      usernames
    }
    sample {
      id
      sampleCode
    }
    file {
      size
      filename
      downloadUrl
    }
  }
`;
export const SampleFieldsFragmentDoc = gql`
  fragment SampleFields on Sample {
    id
    meta
    title
    uuid10
    labels
    project
    comment
    createdAt
    sampleCode
    description
    user {
      id
      emails
      lastName
      firstName
      usernames
    }
  }
`;
export const SampleKindFieldsFragmentDoc = gql`
  fragment SampleKindFields on SampleKind {
    id
    name
    color
    schema
    description
  }
`;
export const UserFieldsFragmentDoc = gql`
  fragment UserFields on User {
    id
    lastName
    firstName
    emails
    role
    authMethods
    usernames
  }
`;
export const EventDocument = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      topic
      createdAt
      data {
        ... on EventDataFile {
          file {
            id
            name
          }
        }
      }
      processors {
        processorId
        history {
          processId
          status
          date
          message
        }
      }
    }
  }
`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    EventQuery,
    EventQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    options,
  );
}
export function useEventLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventQuery,
    EventQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    options,
  );
}
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<
  EventQuery,
  EventQueryVariables
>;
export function refetchEventQuery(variables: EventQueryVariables) {
  return { query: EventDocument, variables: variables };
}
export const EventsFilteredDocument = gql`
  query EventsFiltered(
    $limit: Int
    $skip: Int
    $filterBy: EventFilterInput
    $sortBy: EventSortInput
  ) {
    events(limit: $limit, skip: $skip, filterBy: $filterBy, sortBy: $sortBy) {
      totalCount
      list {
        id
        topic
        createdAt
        data {
          ... on EventDataFile {
            file {
              id
              name
            }
          }
        }
        processors {
          processorId
          history {
            status
            date
            message
          }
        }
      }
    }
  }
`;

/**
 * __useEventsFilteredQuery__
 *
 * To run a query within a React component, call `useEventsFilteredQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsFilteredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsFilteredQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *      filterBy: // value for 'filterBy'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useEventsFilteredQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EventsFilteredQuery,
    EventsFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    EventsFilteredQuery,
    EventsFilteredQueryVariables
  >(EventsFilteredDocument, options);
}
export function useEventsFilteredLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventsFilteredQuery,
    EventsFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    EventsFilteredQuery,
    EventsFilteredQueryVariables
  >(EventsFilteredDocument, options);
}
export type EventsFilteredQueryHookResult = ReturnType<
  typeof useEventsFilteredQuery
>;
export type EventsFilteredLazyQueryHookResult = ReturnType<
  typeof useEventsFilteredLazyQuery
>;
export type EventsFilteredQueryResult = Apollo.QueryResult<
  EventsFilteredQuery,
  EventsFilteredQueryVariables
>;
export function refetchEventsFilteredQuery(
  variables?: EventsFilteredQueryVariables,
) {
  return { query: EventsFilteredDocument, variables: variables };
}
export const DirectoryTreeDocument = gql`
  query DirectoryTree($root: String!) {
    directoryTree(root: $root) {
      path
      type
    }
  }
`;

/**
 * __useDirectoryTreeQuery__
 *
 * To run a query within a React component, call `useDirectoryTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDirectoryTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDirectoryTreeQuery({
 *   variables: {
 *      root: // value for 'root'
 *   },
 * });
 */
export function useDirectoryTreeQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    DirectoryTreeQuery,
    DirectoryTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    DirectoryTreeQuery,
    DirectoryTreeQueryVariables
  >(DirectoryTreeDocument, options);
}
export function useDirectoryTreeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DirectoryTreeQuery,
    DirectoryTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    DirectoryTreeQuery,
    DirectoryTreeQueryVariables
  >(DirectoryTreeDocument, options);
}
export type DirectoryTreeQueryHookResult = ReturnType<
  typeof useDirectoryTreeQuery
>;
export type DirectoryTreeLazyQueryHookResult = ReturnType<
  typeof useDirectoryTreeLazyQuery
>;
export type DirectoryTreeQueryResult = Apollo.QueryResult<
  DirectoryTreeQuery,
  DirectoryTreeQueryVariables
>;
export function refetchDirectoryTreeQuery(
  variables: DirectoryTreeQueryVariables,
) {
  return { query: DirectoryTreeDocument, variables: variables };
}
export const FileSyncOptionsDocument = gql`
  query FileSyncOptions {
    fileSyncOptions {
      ...FileSyncOptionFields
    }
  }
  ${FileSyncOptionFieldsFragmentDoc}
`;

/**
 * __useFileSyncOptionsQuery__
 *
 * To run a query within a React component, call `useFileSyncOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFileSyncOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFileSyncOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useFileSyncOptionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FileSyncOptionsQuery,
    FileSyncOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    FileSyncOptionsQuery,
    FileSyncOptionsQueryVariables
  >(FileSyncOptionsDocument, options);
}
export function useFileSyncOptionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FileSyncOptionsQuery,
    FileSyncOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    FileSyncOptionsQuery,
    FileSyncOptionsQueryVariables
  >(FileSyncOptionsDocument, options);
}
export type FileSyncOptionsQueryHookResult = ReturnType<
  typeof useFileSyncOptionsQuery
>;
export type FileSyncOptionsLazyQueryHookResult = ReturnType<
  typeof useFileSyncOptionsLazyQuery
>;
export type FileSyncOptionsQueryResult = Apollo.QueryResult<
  FileSyncOptionsQuery,
  FileSyncOptionsQueryVariables
>;
export function refetchFileSyncOptionsQuery(
  variables?: FileSyncOptionsQueryVariables,
) {
  return { query: FileSyncOptionsDocument, variables: variables };
}
export const FileSyncOptionDocument = gql`
  query FileSyncOption($id: ID!) {
    fileSyncOption(id: $id) {
      ...FileSyncOptionFields
    }
  }
  ${FileSyncOptionFieldsFragmentDoc}
`;

/**
 * __useFileSyncOptionQuery__
 *
 * To run a query within a React component, call `useFileSyncOptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useFileSyncOptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFileSyncOptionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFileSyncOptionQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    FileSyncOptionQuery,
    FileSyncOptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    FileSyncOptionQuery,
    FileSyncOptionQueryVariables
  >(FileSyncOptionDocument, options);
}
export function useFileSyncOptionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FileSyncOptionQuery,
    FileSyncOptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    FileSyncOptionQuery,
    FileSyncOptionQueryVariables
  >(FileSyncOptionDocument, options);
}
export type FileSyncOptionQueryHookResult = ReturnType<
  typeof useFileSyncOptionQuery
>;
export type FileSyncOptionLazyQueryHookResult = ReturnType<
  typeof useFileSyncOptionLazyQuery
>;
export type FileSyncOptionQueryResult = Apollo.QueryResult<
  FileSyncOptionQuery,
  FileSyncOptionQueryVariables
>;
export function refetchFileSyncOptionQuery(
  variables: FileSyncOptionQueryVariables,
) {
  return { query: FileSyncOptionDocument, variables: variables };
}
export const CreateFileSyncOptionDocument = gql`
  mutation CreateFileSyncOption($input: NewFileSyncOptionInput!) {
    createFileSyncOption(input: $input) {
      id
      ...FileSyncOptionFields
    }
  }
  ${FileSyncOptionFieldsFragmentDoc}
`;

/**
 * __useCreateFileSyncOptionMutation__
 *
 * To run a mutation, you first call `useCreateFileSyncOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFileSyncOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFileSyncOptionMutation, { data, loading, error }] = useCreateFileSyncOptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFileSyncOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateFileSyncOptionMutation,
    CreateFileSyncOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    CreateFileSyncOptionMutation,
    CreateFileSyncOptionMutationVariables
  >(CreateFileSyncOptionDocument, options);
}
export type CreateFileSyncOptionMutationHookResult = ReturnType<
  typeof useCreateFileSyncOptionMutation
>;
export type CreateFileSyncOptionMutationResult =
  Apollo.MutationResult<CreateFileSyncOptionMutation>;
export type CreateFileSyncOptionMutationOptions = Apollo.BaseMutationOptions<
  CreateFileSyncOptionMutation,
  CreateFileSyncOptionMutationVariables
>;
export const EditFileSyncOptionDocument = gql`
  mutation EditFileSyncOption($input: EditFileSyncOptionInput!) {
    editFileSyncOption(input: $input) {
      id
      ...FileSyncOptionFields
    }
  }
  ${FileSyncOptionFieldsFragmentDoc}
`;

/**
 * __useEditFileSyncOptionMutation__
 *
 * To run a mutation, you first call `useEditFileSyncOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFileSyncOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFileSyncOptionMutation, { data, loading, error }] = useEditFileSyncOptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditFileSyncOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    EditFileSyncOptionMutation,
    EditFileSyncOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    EditFileSyncOptionMutation,
    EditFileSyncOptionMutationVariables
  >(EditFileSyncOptionDocument, options);
}
export type EditFileSyncOptionMutationHookResult = ReturnType<
  typeof useEditFileSyncOptionMutation
>;
export type EditFileSyncOptionMutationResult =
  Apollo.MutationResult<EditFileSyncOptionMutation>;
export type EditFileSyncOptionMutationOptions = Apollo.BaseMutationOptions<
  EditFileSyncOptionMutation,
  EditFileSyncOptionMutationVariables
>;
export const DeleteFileSyncOptionDocument = gql`
  mutation DeleteFileSyncOption($input: DeleteFileSyncOptionInput!) {
    deleteFileSyncOption(input: $input) {
      id
      ...FileSyncOptionFields
    }
  }
  ${FileSyncOptionFieldsFragmentDoc}
`;

/**
 * __useDeleteFileSyncOptionMutation__
 *
 * To run a mutation, you first call `useDeleteFileSyncOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileSyncOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileSyncOptionMutation, { data, loading, error }] = useDeleteFileSyncOptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteFileSyncOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteFileSyncOptionMutation,
    DeleteFileSyncOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    DeleteFileSyncOptionMutation,
    DeleteFileSyncOptionMutationVariables
  >(DeleteFileSyncOptionDocument, options);
}
export type DeleteFileSyncOptionMutationHookResult = ReturnType<
  typeof useDeleteFileSyncOptionMutation
>;
export type DeleteFileSyncOptionMutationResult =
  Apollo.MutationResult<DeleteFileSyncOptionMutation>;
export type DeleteFileSyncOptionMutationOptions = Apollo.BaseMutationOptions<
  DeleteFileSyncOptionMutation,
  DeleteFileSyncOptionMutationVariables
>;
export const FilesByConfigDocument = gql`
  query FilesByConfig($id: String!, $path: [String!]!) {
    filesByConfig(configId: $id, path: $path) {
      __typename
      _id
      ignoredFiles
      files {
        ...RevisionFields
        countRevisions
        status
        downloadUrl
        filename
      }
      dirs {
        ...RevisionFields
      }
    }
  }
  ${RevisionFieldsFragmentDoc}
`;

/**
 * __useFilesByConfigQuery__
 *
 * To run a query within a React component, call `useFilesByConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilesByConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilesByConfigQuery({
 *   variables: {
 *      id: // value for 'id'
 *      path: // value for 'path'
 *   },
 * });
 */
export function useFilesByConfigQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    FilesByConfigQuery,
    FilesByConfigQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    FilesByConfigQuery,
    FilesByConfigQueryVariables
  >(FilesByConfigDocument, options);
}
export function useFilesByConfigLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FilesByConfigQuery,
    FilesByConfigQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    FilesByConfigQuery,
    FilesByConfigQueryVariables
  >(FilesByConfigDocument, options);
}
export type FilesByConfigQueryHookResult = ReturnType<
  typeof useFilesByConfigQuery
>;
export type FilesByConfigLazyQueryHookResult = ReturnType<
  typeof useFilesByConfigLazyQuery
>;
export type FilesByConfigQueryResult = Apollo.QueryResult<
  FilesByConfigQuery,
  FilesByConfigQueryVariables
>;
export function refetchFilesByConfigQuery(
  variables: FilesByConfigQueryVariables,
) {
  return { query: FilesByConfigDocument, variables: variables };
}
export const EventsByFileIdDocument = gql`
  query EventsByFileId($id: String!) {
    events(filterBy: { fileId: $id }) {
      __typename
      list {
        id
        topic
        processors {
          processorId
          history {
            status
            date
            message
          }
        }
      }
    }
  }
`;

/**
 * __useEventsByFileIdQuery__
 *
 * To run a query within a React component, call `useEventsByFileIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsByFileIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsByFileIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventsByFileIdQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    EventsByFileIdQuery,
    EventsByFileIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    EventsByFileIdQuery,
    EventsByFileIdQueryVariables
  >(EventsByFileIdDocument, options);
}
export function useEventsByFileIdLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventsByFileIdQuery,
    EventsByFileIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    EventsByFileIdQuery,
    EventsByFileIdQueryVariables
  >(EventsByFileIdDocument, options);
}
export type EventsByFileIdQueryHookResult = ReturnType<
  typeof useEventsByFileIdQuery
>;
export type EventsByFileIdLazyQueryHookResult = ReturnType<
  typeof useEventsByFileIdLazyQuery
>;
export type EventsByFileIdQueryResult = Apollo.QueryResult<
  EventsByFileIdQuery,
  EventsByFileIdQueryVariables
>;
export function refetchEventsByFileIdQuery(
  variables: EventsByFileIdQueryVariables,
) {
  return { query: EventsByFileIdDocument, variables: variables };
}
export const FilesByConfigFlatDocument = gql`
  query FilesByConfigFlat(
    $id: String!
    $limit: Int
    $skip: Int
    $filterBy: FilesFilterInput
    $sortBy: FilesSortInput
  ) {
    filesByConfigFlat(
      id: $id
      limit: $limit
      skip: $skip
      filterBy: $filterBy
      sortBy: $sortBy
    ) {
      totalCount
      list {
        __typename
        id
        filename
        size
        relativePath
        status
        date
        downloadUrl
      }
    }
  }
`;

/**
 * __useFilesByConfigFlatQuery__
 *
 * To run a query within a React component, call `useFilesByConfigFlatQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilesByConfigFlatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilesByConfigFlatQuery({
 *   variables: {
 *      id: // value for 'id'
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *      filterBy: // value for 'filterBy'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useFilesByConfigFlatQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    FilesByConfigFlatQuery,
    FilesByConfigFlatQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    FilesByConfigFlatQuery,
    FilesByConfigFlatQueryVariables
  >(FilesByConfigFlatDocument, options);
}
export function useFilesByConfigFlatLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FilesByConfigFlatQuery,
    FilesByConfigFlatQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    FilesByConfigFlatQuery,
    FilesByConfigFlatQueryVariables
  >(FilesByConfigFlatDocument, options);
}
export type FilesByConfigFlatQueryHookResult = ReturnType<
  typeof useFilesByConfigFlatQuery
>;
export type FilesByConfigFlatLazyQueryHookResult = ReturnType<
  typeof useFilesByConfigFlatLazyQuery
>;
export type FilesByConfigFlatQueryResult = Apollo.QueryResult<
  FilesByConfigFlatQuery,
  FilesByConfigFlatQueryVariables
>;
export function refetchFilesByConfigFlatQuery(
  variables: FilesByConfigFlatQueryVariables,
) {
  return { query: FilesByConfigFlatDocument, variables: variables };
}
export const ReadyChecksDocument = gql`
  query ReadyChecks {
    readyChecks {
      name
      hasArg
    }
  }
`;

/**
 * __useReadyChecksQuery__
 *
 * To run a query within a React component, call `useReadyChecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadyChecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadyChecksQuery({
 *   variables: {
 *   },
 * });
 */
export function useReadyChecksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ReadyChecksQuery,
    ReadyChecksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<ReadyChecksQuery, ReadyChecksQueryVariables>(
    ReadyChecksDocument,
    options,
  );
}
export function useReadyChecksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ReadyChecksQuery,
    ReadyChecksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    ReadyChecksQuery,
    ReadyChecksQueryVariables
  >(ReadyChecksDocument, options);
}
export type ReadyChecksQueryHookResult = ReturnType<typeof useReadyChecksQuery>;
export type ReadyChecksLazyQueryHookResult = ReturnType<
  typeof useReadyChecksLazyQuery
>;
export type ReadyChecksQueryResult = Apollo.QueryResult<
  ReadyChecksQuery,
  ReadyChecksQueryVariables
>;
export function refetchReadyChecksQuery(variables?: ReadyChecksQueryVariables) {
  return { query: ReadyChecksDocument, variables: variables };
}
export const MeasurementsFilteredDocument = gql`
  query MeasurementsFiltered(
    $type: MeasurementTypes!
    $limit: Int
    $skip: Int
    $filterBy: MeasurementFilterInput
    $sortBy: MeasurementSortInput
  ) {
    measurements(
      type: $type
      limit: $limit
      skip: $skip
      filterBy: $filterBy
      sortBy: $sortBy
    ) {
      totalCount
      list {
        ...MeasurementFields
      }
    }
  }
  ${MeasurementFieldsFragmentDoc}
`;

/**
 * __useMeasurementsFilteredQuery__
 *
 * To run a query within a React component, call `useMeasurementsFilteredQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementsFilteredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementsFilteredQuery({
 *   variables: {
 *      type: // value for 'type'
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *      filterBy: // value for 'filterBy'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useMeasurementsFilteredQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    MeasurementsFilteredQuery,
    MeasurementsFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    MeasurementsFilteredQuery,
    MeasurementsFilteredQueryVariables
  >(MeasurementsFilteredDocument, options);
}
export function useMeasurementsFilteredLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MeasurementsFilteredQuery,
    MeasurementsFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    MeasurementsFilteredQuery,
    MeasurementsFilteredQueryVariables
  >(MeasurementsFilteredDocument, options);
}
export type MeasurementsFilteredQueryHookResult = ReturnType<
  typeof useMeasurementsFilteredQuery
>;
export type MeasurementsFilteredLazyQueryHookResult = ReturnType<
  typeof useMeasurementsFilteredLazyQuery
>;
export type MeasurementsFilteredQueryResult = Apollo.QueryResult<
  MeasurementsFilteredQuery,
  MeasurementsFilteredQueryVariables
>;
export function refetchMeasurementsFilteredQuery(
  variables: MeasurementsFilteredQueryVariables,
) {
  return { query: MeasurementsFilteredDocument, variables: variables };
}
export const MeasurementDocument = gql`
  query Measurement($id: ID!, $type: MeasurementTypes!) {
    measurement(id: $id, type: $type) {
      ...MeasurementFields
    }
  }
  ${MeasurementFieldsFragmentDoc}
`;

/**
 * __useMeasurementQuery__
 *
 * To run a query within a React component, call `useMeasurementQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeasurementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeasurementQuery({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useMeasurementQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    MeasurementQuery,
    MeasurementQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<MeasurementQuery, MeasurementQueryVariables>(
    MeasurementDocument,
    options,
  );
}
export function useMeasurementLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MeasurementQuery,
    MeasurementQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    MeasurementQuery,
    MeasurementQueryVariables
  >(MeasurementDocument, options);
}
export type MeasurementQueryHookResult = ReturnType<typeof useMeasurementQuery>;
export type MeasurementLazyQueryHookResult = ReturnType<
  typeof useMeasurementLazyQuery
>;
export type MeasurementQueryResult = Apollo.QueryResult<
  MeasurementQuery,
  MeasurementQueryVariables
>;
export function refetchMeasurementQuery(variables: MeasurementQueryVariables) {
  return { query: MeasurementDocument, variables: variables };
}
export const CreateMeasurementDocument = gql`
  mutation CreateMeasurement(
    $type: MeasurementTypes!
    $sampleId: String!
    $input: MeasurementInput!
  ) {
    createMeasurement(type: $type, sampleId: $sampleId, input: $input) {
      ...MeasurementFields
    }
  }
  ${MeasurementFieldsFragmentDoc}
`;

/**
 * __useCreateMeasurementMutation__
 *
 * To run a mutation, you first call `useCreateMeasurementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMeasurementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMeasurementMutation, { data, loading, error }] = useCreateMeasurementMutation({
 *   variables: {
 *      type: // value for 'type'
 *      sampleId: // value for 'sampleId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMeasurementMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateMeasurementMutation,
    CreateMeasurementMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    CreateMeasurementMutation,
    CreateMeasurementMutationVariables
  >(CreateMeasurementDocument, options);
}
export type CreateMeasurementMutationHookResult = ReturnType<
  typeof useCreateMeasurementMutation
>;
export type CreateMeasurementMutationResult =
  Apollo.MutationResult<CreateMeasurementMutation>;
export type CreateMeasurementMutationOptions = Apollo.BaseMutationOptions<
  CreateMeasurementMutation,
  CreateMeasurementMutationVariables
>;
export const SamplesFilteredDocument = gql`
  query SamplesFiltered(
    $kind: String!
    $limit: Int
    $skip: Int
    $filterBy: SampleFilterInput
    $sortBy: SampleSortInput
  ) {
    samples(
      kind: $kind
      limit: $limit
      skip: $skip
      filterBy: $filterBy
      sortBy: $sortBy
    ) {
      totalCount
      list {
        ...SampleFields
        children {
          ...SampleFields
        }
        parent {
          id
        }
      }
    }
  }
  ${SampleFieldsFragmentDoc}
`;

/**
 * __useSamplesFilteredQuery__
 *
 * To run a query within a React component, call `useSamplesFilteredQuery` and pass it any options that fit your needs.
 * When your component renders, `useSamplesFilteredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSamplesFilteredQuery({
 *   variables: {
 *      kind: // value for 'kind'
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *      filterBy: // value for 'filterBy'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useSamplesFilteredQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    SamplesFilteredQuery,
    SamplesFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<
    SamplesFilteredQuery,
    SamplesFilteredQueryVariables
  >(SamplesFilteredDocument, options);
}
export function useSamplesFilteredLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SamplesFilteredQuery,
    SamplesFilteredQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    SamplesFilteredQuery,
    SamplesFilteredQueryVariables
  >(SamplesFilteredDocument, options);
}
export type SamplesFilteredQueryHookResult = ReturnType<
  typeof useSamplesFilteredQuery
>;
export type SamplesFilteredLazyQueryHookResult = ReturnType<
  typeof useSamplesFilteredLazyQuery
>;
export type SamplesFilteredQueryResult = Apollo.QueryResult<
  SamplesFilteredQuery,
  SamplesFilteredQueryVariables
>;
export function refetchSamplesFilteredQuery(
  variables: SamplesFilteredQueryVariables,
) {
  return { query: SamplesFilteredDocument, variables: variables };
}
export const SampleDocument = gql`
  query Sample($id: ID!) {
    sample(id: $id) {
      __typename
      ...SampleFields
      attachments {
        id
        date
        size
        filename
        collection
        downloadUrl
      }
      measurements {
        id
        type
        title
        createdAt
        description
        file {
          size
          filename
          downloadUrl
        }
      }
      children {
        ...SampleFields
      }
    }
  }
  ${SampleFieldsFragmentDoc}
`;

/**
 * __useSampleQuery__
 *
 * To run a query within a React component, call `useSampleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSampleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSampleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSampleQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    SampleQuery,
    SampleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<SampleQuery, SampleQueryVariables>(
    SampleDocument,
    options,
  );
}
export function useSampleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SampleQuery,
    SampleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<SampleQuery, SampleQueryVariables>(
    SampleDocument,
    options,
  );
}
export type SampleQueryHookResult = ReturnType<typeof useSampleQuery>;
export type SampleLazyQueryHookResult = ReturnType<typeof useSampleLazyQuery>;
export type SampleQueryResult = Apollo.QueryResult<
  SampleQuery,
  SampleQueryVariables
>;
export function refetchSampleQuery(variables: SampleQueryVariables) {
  return { query: SampleDocument, variables: variables };
}
export const SampleKindDocument = gql`
  query SampleKind($id: ID!) {
    sampleKind(id: $id) {
      ...SampleKindFields
    }
  }
  ${SampleKindFieldsFragmentDoc}
`;

/**
 * __useSampleKindQuery__
 *
 * To run a query within a React component, call `useSampleKindQuery` and pass it any options that fit your needs.
 * When your component renders, `useSampleKindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSampleKindQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSampleKindQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    SampleKindQuery,
    SampleKindQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<SampleKindQuery, SampleKindQueryVariables>(
    SampleKindDocument,
    options,
  );
}
export function useSampleKindLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SampleKindQuery,
    SampleKindQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    SampleKindQuery,
    SampleKindQueryVariables
  >(SampleKindDocument, options);
}
export type SampleKindQueryHookResult = ReturnType<typeof useSampleKindQuery>;
export type SampleKindLazyQueryHookResult = ReturnType<
  typeof useSampleKindLazyQuery
>;
export type SampleKindQueryResult = Apollo.QueryResult<
  SampleKindQuery,
  SampleKindQueryVariables
>;
export function refetchSampleKindQuery(variables: SampleKindQueryVariables) {
  return { query: SampleKindDocument, variables: variables };
}
export const CreateSampleDocument = gql`
  mutation CreateSample($input: SampleInput!) {
    createSample(input: $input) {
      ...SampleFields
    }
  }
  ${SampleFieldsFragmentDoc}
`;

/**
 * __useCreateSampleMutation__
 *
 * To run a mutation, you first call `useCreateSampleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSampleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSampleMutation, { data, loading, error }] = useCreateSampleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSampleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateSampleMutation,
    CreateSampleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    CreateSampleMutation,
    CreateSampleMutationVariables
  >(CreateSampleDocument, options);
}
export type CreateSampleMutationHookResult = ReturnType<
  typeof useCreateSampleMutation
>;
export type CreateSampleMutationResult =
  Apollo.MutationResult<CreateSampleMutation>;
export type CreateSampleMutationOptions = Apollo.BaseMutationOptions<
  CreateSampleMutation,
  CreateSampleMutationVariables
>;
export const CreateMultipleSamplesDocument = gql`
  mutation CreateMultipleSamples($samples: [SampleInput!]!) {
    createSamples(samples: $samples) {
      ...SampleFields
    }
  }
  ${SampleFieldsFragmentDoc}
`;

/**
 * __useCreateMultipleSamplesMutation__
 *
 * To run a mutation, you first call `useCreateMultipleSamplesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleSamplesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleSamplesMutation, { data, loading, error }] = useCreateMultipleSamplesMutation({
 *   variables: {
 *      samples: // value for 'samples'
 *   },
 * });
 */
export function useCreateMultipleSamplesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateMultipleSamplesMutation,
    CreateMultipleSamplesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    CreateMultipleSamplesMutation,
    CreateMultipleSamplesMutationVariables
  >(CreateMultipleSamplesDocument, options);
}
export type CreateMultipleSamplesMutationHookResult = ReturnType<
  typeof useCreateMultipleSamplesMutation
>;
export type CreateMultipleSamplesMutationResult =
  Apollo.MutationResult<CreateMultipleSamplesMutation>;
export type CreateMultipleSamplesMutationOptions = Apollo.BaseMutationOptions<
  CreateMultipleSamplesMutation,
  CreateMultipleSamplesMutationVariables
>;
export const UpdateSampleDocument = gql`
  mutation updateSample($id: ID!, $input: SampleInput!) {
    updateSample(id: $id, input: $input) {
      ...SampleFields
    }
  }
  ${SampleFieldsFragmentDoc}
`;

/**
 * __useUpdateSampleMutation__
 *
 * To run a mutation, you first call `useUpdateSampleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSampleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSampleMutation, { data, loading, error }] = useUpdateSampleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSampleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateSampleMutation,
    UpdateSampleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useMutation<
    UpdateSampleMutation,
    UpdateSampleMutationVariables
  >(UpdateSampleDocument, options);
}
export type UpdateSampleMutationHookResult = ReturnType<
  typeof useUpdateSampleMutation
>;
export type UpdateSampleMutationResult =
  Apollo.MutationResult<UpdateSampleMutation>;
export type UpdateSampleMutationOptions = Apollo.BaseMutationOptions<
  UpdateSampleMutation,
  UpdateSampleMutationVariables
>;
export const UsersDocument = gql`
  query Users {
    users {
      ...UserFields
    }
  }
  ${UserFieldsFragmentDoc}
`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export function useUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
  return { query: UsersDocument, variables: variables };
}
export const UsersInputDocument = gql`
  query UsersInput($input: String!, $limit: Int) {
    usersInput(input: $input, limit: $limit) {
      totalCount
      list {
        ...UserFields
      }
    }
  }
  ${UserFieldsFragmentDoc}
`;

/**
 * __useUsersInputQuery__
 *
 * To run a query within a React component, call `useUsersInputQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersInputQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersInputQuery({
 *   variables: {
 *      input: // value for 'input'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUsersInputQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    UsersInputQuery,
    UsersInputQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useQuery<UsersInputQuery, UsersInputQueryVariables>(
    UsersInputDocument,
    options,
  );
}
export function useUsersInputLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersInputQuery,
    UsersInputQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return ApolloReactHooks.useLazyQuery<
    UsersInputQuery,
    UsersInputQueryVariables
  >(UsersInputDocument, options);
}
export type UsersInputQueryHookResult = ReturnType<typeof useUsersInputQuery>;
export type UsersInputLazyQueryHookResult = ReturnType<
  typeof useUsersInputLazyQuery
>;
export type UsersInputQueryResult = Apollo.QueryResult<
  UsersInputQuery,
  UsersInputQueryVariables
>;
export function refetchUsersInputQuery(variables: UsersInputQueryVariables) {
  return { query: UsersInputDocument, variables: variables };
}
