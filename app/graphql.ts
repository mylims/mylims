import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import User from './Models/User';
import { FileSyncOption } from '../addons/file-sync/Models/FileSyncOption';
import { SyncFile } from '../addons/file-sync/Models/SyncFile';
import { Event } from '../addons/events/Models/Event';
import { Sample } from './Models/Sample';
import { SampleKind } from './Models/SampleKind';
import { ApolloBaseContext } from '@ioc:Zakodium/Apollo/Server';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type GqlActivity = GqlActivityFile | GqlActivityMeasurement;

export type GqlActivityFile = {
  __typename?: 'ActivityFile';
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  fileId: Scalars['ID'];
  type: Scalars['String'];
};

export type GqlActivityMeasurement = {
  __typename?: 'ActivityMeasurement';
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  measurementId: Scalars['ID'];
  measurementType: GqlMeasurementTypes;
  type: Scalars['String'];
};

export type GqlDeleteFileSyncOptionInput = {
  id: Scalars['ID'];
};

export type GqlDirectoryEntry = {
  __typename?: 'DirectoryEntry';
  path: Scalars['String'];
  type: GqlDirectoryEntryType;
};

export enum GqlDirectoryEntryType {
  DIRECTORY = 'directory',
  FILE = 'file',
}

export type GqlEditFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlFileSyncOptionPatternInput>;
  readyChecks: Array<GqlReadyCheckInput>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type GqlEvent = {
  __typename?: 'Event';
  createdAt: Scalars['DateTime'];
  data: GqlEventData;
  id: Scalars['ID'];
  processors: Array<GqlEventProcessor>;
  topic: Scalars['String'];
};

export type GqlEventData = {
  type: GqlEventDataType;
};

export type GqlEventDataFile = GqlEventData & {
  __typename?: 'EventDataFile';
  file: GqlEventFile;
  fileId: Scalars['String'];
  type: GqlEventDataType;
};

export enum GqlEventDataType {
  FILE = 'file',
}

export type GqlEventFile = {
  __typename?: 'EventFile';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GqlEventFilterInput = {
  fileId?: Maybe<Scalars['String']>;
  processorId?: Maybe<Scalars['String']>;
  status?: Maybe<Array<GqlEventStatus>>;
  topic?: Maybe<Scalars['String']>;
};

export type GqlEventHistory = {
  __typename?: 'EventHistory';
  date: Scalars['DateTime'];
  message?: Maybe<Scalars['String']>;
  processId: Scalars['String'];
  status: GqlEventStatus;
};

export type GqlEventPage = GqlPagination & {
  __typename?: 'EventPage';
  list: Array<GqlEvent>;
  totalCount: Scalars['Int'];
};

export type GqlEventProcessor = {
  __typename?: 'EventProcessor';
  history: Array<GqlEventHistory>;
  processorId: Scalars['String'];
};

export enum GqlEventSortField {
  CREATEDAT = 'createdAt',
  DATE = 'date',
  PROCESSORID = 'processorId',
  STATUS = 'status',
  TOPIC = 'topic',
}

export type GqlEventSortInput = {
  direction: GqlSortDirection;
  field: GqlEventSortField;
};

export enum GqlEventStatus {
  ERROR = 'error',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
}

export type GqlFileContent = {
  __typename?: 'FileContent';
  content: Scalars['String'];
  filename: Scalars['String'];
  size: Scalars['Int'];
};

export enum GqlFileStatus {
  IMPORT_FAIL = 'import_fail',
  IMPORTED = 'imported',
  IMPORTING = 'importing',
  PENDING = 'pending',
}

export type GqlFileSyncOption = {
  __typename?: 'FileSyncOption';
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlPattern>;
  readyChecks: Array<GqlReadyCheck>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type GqlFileSyncOptionPatternInput = {
  pattern: Scalars['String'];
  type: GqlPatternType;
};

export type GqlFilesFilterInput = {
  filename?: Maybe<Scalars['String']>;
  maxDate?: Maybe<Scalars['DateTime']>;
  maxSize?: Maybe<Scalars['Int']>;
  minDate?: Maybe<Scalars['DateTime']>;
  minSize?: Maybe<Scalars['Int']>;
  status?: Maybe<Array<GqlFileStatus>>;
};

export type GqlFilesFlatPage = GqlPagination & {
  __typename?: 'FilesFlatPage';
  list: Array<GqlSyncFileRevision>;
  totalCount: Scalars['Int'];
};

export enum GqlFilesSortField {
  CREATIONDATE = 'creationDate',
  DATE = 'date',
  FILENAME = 'filename',
  MODIFICATIONDATE = 'modificationDate',
  SIZE = 'size',
}

export type GqlFilesSortInput = {
  direction: GqlSortDirection;
  field: GqlFilesSortField;
};

export type GqlMeasurement = {
  __typename?: 'Measurement';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  derived?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['String']>;
  eventId: Scalars['String'];
  file?: Maybe<GqlMeasurementFile>;
  fileId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  sampleCode: Array<Scalars['String']>;
  type: GqlMeasurementTypes;
  username: Scalars['String'];
};

export type GqlMeasurementFile = {
  __typename?: 'MeasurementFile';
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  size: Scalars['Int'];
};

export type GqlMeasurementFilterInput = {
  createdBy?: Maybe<Scalars['String']>;
  sampleCode?: Maybe<Array<Scalars['String']>>;
  username?: Maybe<Scalars['String']>;
};

export type GqlMeasurementPage = GqlPagination & {
  __typename?: 'MeasurementPage';
  list: Array<GqlMeasurement>;
  totalCount: Scalars['Int'];
};

export enum GqlMeasurementSortField {
  CREATEDAT = 'createdAt',
  CREATEDBY = 'createdBy',
  USERNAME = 'username',
}

export type GqlMeasurementSortInput = {
  direction: GqlSortDirection;
  field: GqlMeasurementSortField;
};

export enum GqlMeasurementTypes {
  TRANSFER = 'transfer',
}

export type GqlMutation = {
  __typename?: 'Mutation';
  createFileSyncOption: GqlFileSyncOption;
  createSample: GqlSample;
  createSampleKind: GqlSampleKind;
  deleteFileSyncOption: Array<GqlFileSyncOption>;
  editFileSyncOption: GqlFileSyncOption;
  updateSample: GqlSample;
  updateSampleKind: GqlSampleKind;
};

export type GqlMutationCreateFileSyncOptionArgs = {
  input: GqlNewFileSyncOptionInput;
};

export type GqlMutationCreateSampleArgs = {
  input: GqlSampleInput;
};

export type GqlMutationCreateSampleKindArgs = {
  input: GqlSampleKindInput;
};

export type GqlMutationDeleteFileSyncOptionArgs = {
  input: GqlDeleteFileSyncOptionInput;
};

export type GqlMutationEditFileSyncOptionArgs = {
  input: GqlEditFileSyncOptionInput;
};

export type GqlMutationUpdateSampleArgs = {
  id: Scalars['ID'];
  input: GqlSampleInput;
};

export type GqlMutationUpdateSampleKindArgs = {
  id: Scalars['ID'];
  input: GqlSampleKindInput;
};

export type GqlNewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlFileSyncOptionPatternInput>;
  readyChecks: Array<GqlReadyCheckInput>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

export type GqlPagination = {
  list: Array<GqlPaginationNode>;
  totalCount: Scalars['Int'];
};

export type GqlPaginationNode =
  | GqlEvent
  | GqlMeasurement
  | GqlSample
  | GqlSyncFileRevision;

export type GqlPattern = {
  __typename?: 'Pattern';
  pattern: Scalars['String'];
  type: GqlPatternType;
};

export enum GqlPatternType {
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export type GqlQuery = {
  __typename?: 'Query';
  directoryTree: Array<GqlDirectoryEntry>;
  event: GqlEvent;
  events: GqlEventPage;
  fileByPath: GqlFileContent;
  fileSyncOption: GqlFileSyncOption;
  fileSyncOptions: Array<GqlFileSyncOption>;
  filesByConfig: GqlSyncTreeRevision;
  filesByConfigFlat: GqlFilesFlatPage;
  measurement: GqlMeasurement;
  measurements: GqlMeasurementPage;
  readyChecks: Array<GqlReadyCheckDescriptor>;
  sample: GqlSample;
  sampleKind: GqlSampleKind;
  samples: GqlSamplePage;
  users: Array<GqlUser>;
};

export type GqlQueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type GqlQueryEventArgs = {
  id: Scalars['ID'];
};

export type GqlQueryEventsArgs = {
  filterBy?: Maybe<GqlEventFilterInput>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<GqlEventSortInput>;
};

export type GqlQueryFileByPathArgs = {
  path: Scalars['String'];
};

export type GqlQueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type GqlQueryFilesByConfigArgs = {
  configId: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  path: Array<Scalars['String']>;
};

export type GqlQueryFilesByConfigFlatArgs = {
  filterBy?: Maybe<GqlFilesFilterInput>;
  id: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<GqlFilesSortInput>;
};

export type GqlQueryMeasurementArgs = {
  id: Scalars['ID'];
  type: GqlMeasurementTypes;
};

export type GqlQueryMeasurementsArgs = {
  filterBy?: Maybe<GqlMeasurementFilterInput>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<GqlMeasurementSortInput>;
  type: GqlMeasurementTypes;
};

export type GqlQuerySampleArgs = {
  id: Scalars['ID'];
};

export type GqlQuerySampleKindArgs = {
  id: Scalars['ID'];
};

export type GqlQuerySamplesArgs = {
  filterBy?: Maybe<GqlSampleFilterInput>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<GqlSampleSortInput>;
};

export type GqlReadyCheck = {
  __typename?: 'ReadyCheck';
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type GqlReadyCheckDescriptor = {
  __typename?: 'ReadyCheckDescriptor';
  hasArg: Scalars['Boolean'];
  name: Scalars['String'];
};

export type GqlReadyCheckInput = {
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type GqlSample = {
  __typename?: 'Sample';
  attachments: Array<GqlSampleFile>;
  children?: Maybe<Array<GqlSample>>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  kind: GqlSampleKind;
  labels: Array<Scalars['String']>;
  measurements: Array<GqlSampleMeasurement>;
  meta: Scalars['JSON'];
  parent?: Maybe<GqlSample>;
  project?: Maybe<Scalars['String']>;
  sampleCode: Array<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<GqlUser>;
  uuid10: Scalars['String'];
};

export type GqlSampleFile = {
  __typename?: 'SampleFile';
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  size: Scalars['Int'];
};

export type GqlSampleFilterInput = {
  description?: Maybe<Scalars['String']>;
  kind?: Maybe<Scalars['String']>;
  labels?: Maybe<Array<Scalars['String']>>;
  parent?: Maybe<Scalars['ID']>;
  project?: Maybe<Scalars['String']>;
  sampleCode?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type GqlSampleInput = {
  description?: Maybe<Scalars['String']>;
  kind: Scalars['String'];
  labels: Array<Scalars['String']>;
  meta: Scalars['JSON'];
  parent?: Maybe<Scalars['String']>;
  project?: Maybe<Scalars['String']>;
  sampleCode: Array<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type GqlSampleKind = {
  __typename?: 'SampleKind';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  schema: Scalars['JSON'];
};

export type GqlSampleKindInput = {
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  schema: Scalars['JSON'];
};

export type GqlSampleMeasurement = {
  __typename?: 'SampleMeasurement';
  date: Scalars['DateTime'];
  id: Scalars['ID'];
  type: Scalars['String'];
};

export type GqlSamplePage = GqlPagination & {
  __typename?: 'SamplePage';
  list: Array<GqlSample>;
  totalCount: Scalars['Int'];
};

export enum GqlSampleSortField {
  CREATEDAT = 'createdAt',
  CREATEDBY = 'createdBy',
  USERNAME = 'username',
}

export type GqlSampleSortInput = {
  direction: GqlSortDirection;
  field: GqlSampleSortField;
};

export enum GqlSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type GqlSyncDirRevision = GqlSyncElementRevision & {
  __typename?: 'SyncDirRevision';
  date: Scalars['DateTime'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
};

export type GqlSyncElementRevision = {
  date: Scalars['DateTime'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
};

export type GqlSyncFileRevision = GqlSyncElementRevision & {
  __typename?: 'SyncFileRevision';
  countRevisions: Scalars['Int'];
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['String'];
  path: Array<Scalars['String']>;
  relativePath: Scalars['String'];
  size: Scalars['Int'];
  status: GqlFileStatus;
};

export type GqlSyncTreeRevision = {
  __typename?: 'SyncTreeRevision';
  _id: Scalars['String'];
  dirs: Array<GqlSyncDirRevision>;
  files: Array<GqlSyncFileRevision>;
  ignoredFiles: Scalars['Int'];
};

export type GqlUser = {
  __typename?: 'User';
  authMethods: Scalars['JSONObject'];
  emails: Array<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  role: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = ResolversObject<{
  Activity:
    | GqlResolversTypes['ActivityFile']
    | GqlResolversTypes['ActivityMeasurement'];
  ActivityFile: ResolverTypeWrapper<GqlActivityFile>;
  ActivityMeasurement: ResolverTypeWrapper<GqlActivityMeasurement>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  DirectoryEntry: ResolverTypeWrapper<GqlDirectoryEntry>;
  DirectoryEntryType: GqlDirectoryEntryType;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Event: ResolverTypeWrapper<Event>;
  EventData: GqlResolversTypes['EventDataFile'];
  EventDataFile: ResolverTypeWrapper<GqlEventDataFile>;
  EventDataType: GqlEventDataType;
  EventFile: ResolverTypeWrapper<GqlEventFile>;
  EventFilterInput: GqlEventFilterInput;
  EventHistory: ResolverTypeWrapper<GqlEventHistory>;
  EventPage: ResolverTypeWrapper<
    Omit<GqlEventPage, 'list'> & { list: Array<GqlResolversTypes['Event']> }
  >;
  EventProcessor: ResolverTypeWrapper<GqlEventProcessor>;
  EventSortField: GqlEventSortField;
  EventSortInput: GqlEventSortInput;
  EventStatus: GqlEventStatus;
  FileContent: ResolverTypeWrapper<GqlFileContent>;
  FileStatus: GqlFileStatus;
  FileSyncOption: ResolverTypeWrapper<FileSyncOption>;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
  FilesFilterInput: GqlFilesFilterInput;
  FilesFlatPage: ResolverTypeWrapper<GqlFilesFlatPage>;
  FilesSortField: GqlFilesSortField;
  FilesSortInput: GqlFilesSortInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Measurement: ResolverTypeWrapper<GqlMeasurement>;
  MeasurementFile: ResolverTypeWrapper<GqlMeasurementFile>;
  MeasurementFilterInput: GqlMeasurementFilterInput;
  MeasurementPage: ResolverTypeWrapper<GqlMeasurementPage>;
  MeasurementSortField: GqlMeasurementSortField;
  MeasurementSortInput: GqlMeasurementSortInput;
  MeasurementTypes: GqlMeasurementTypes;
  Mutation: ResolverTypeWrapper<{}>;
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  Pagination:
    | GqlResolversTypes['EventPage']
    | GqlResolversTypes['FilesFlatPage']
    | GqlResolversTypes['MeasurementPage']
    | GqlResolversTypes['SamplePage'];
  PaginationNode:
    | GqlResolversTypes['Event']
    | GqlResolversTypes['Measurement']
    | GqlResolversTypes['Sample']
    | GqlResolversTypes['SyncFileRevision'];
  Pattern: ResolverTypeWrapper<GqlPattern>;
  PatternType: GqlPatternType;
  Query: ResolverTypeWrapper<{}>;
  ReadyCheck: ResolverTypeWrapper<GqlReadyCheck>;
  ReadyCheckDescriptor: ResolverTypeWrapper<GqlReadyCheckDescriptor>;
  ReadyCheckInput: GqlReadyCheckInput;
  Sample: ResolverTypeWrapper<Sample>;
  SampleFile: ResolverTypeWrapper<GqlSampleFile>;
  SampleFilterInput: GqlSampleFilterInput;
  SampleInput: GqlSampleInput;
  SampleKind: ResolverTypeWrapper<SampleKind>;
  SampleKindInput: GqlSampleKindInput;
  SampleMeasurement: ResolverTypeWrapper<GqlSampleMeasurement>;
  SamplePage: ResolverTypeWrapper<
    Omit<GqlSamplePage, 'list'> & { list: Array<GqlResolversTypes['Sample']> }
  >;
  SampleSortField: GqlSampleSortField;
  SampleSortInput: GqlSampleSortInput;
  SortDirection: GqlSortDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  SyncDirRevision: ResolverTypeWrapper<GqlSyncDirRevision>;
  SyncElementRevision:
    | GqlResolversTypes['SyncDirRevision']
    | GqlResolversTypes['SyncFileRevision'];
  SyncFileRevision: ResolverTypeWrapper<GqlSyncFileRevision>;
  SyncTreeRevision: ResolverTypeWrapper<GqlSyncTreeRevision>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = ResolversObject<{
  Activity:
    | GqlResolversParentTypes['ActivityFile']
    | GqlResolversParentTypes['ActivityMeasurement'];
  ActivityFile: GqlActivityFile;
  ActivityMeasurement: GqlActivityMeasurement;
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  DirectoryEntry: GqlDirectoryEntry;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Event: Event;
  EventData: GqlResolversParentTypes['EventDataFile'];
  EventDataFile: GqlEventDataFile;
  EventFile: GqlEventFile;
  EventFilterInput: GqlEventFilterInput;
  EventHistory: GqlEventHistory;
  EventPage: Omit<GqlEventPage, 'list'> & {
    list: Array<GqlResolversParentTypes['Event']>;
  };
  EventProcessor: GqlEventProcessor;
  EventSortInput: GqlEventSortInput;
  FileContent: GqlFileContent;
  FileSyncOption: FileSyncOption;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
  FilesFilterInput: GqlFilesFilterInput;
  FilesFlatPage: GqlFilesFlatPage;
  FilesSortInput: GqlFilesSortInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Measurement: GqlMeasurement;
  MeasurementFile: GqlMeasurementFile;
  MeasurementFilterInput: GqlMeasurementFilterInput;
  MeasurementPage: GqlMeasurementPage;
  MeasurementSortInput: GqlMeasurementSortInput;
  Mutation: {};
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  Pagination:
    | GqlResolversParentTypes['EventPage']
    | GqlResolversParentTypes['FilesFlatPage']
    | GqlResolversParentTypes['MeasurementPage']
    | GqlResolversParentTypes['SamplePage'];
  PaginationNode:
    | GqlResolversParentTypes['Event']
    | GqlResolversParentTypes['Measurement']
    | GqlResolversParentTypes['Sample']
    | GqlResolversParentTypes['SyncFileRevision'];
  Pattern: GqlPattern;
  Query: {};
  ReadyCheck: GqlReadyCheck;
  ReadyCheckDescriptor: GqlReadyCheckDescriptor;
  ReadyCheckInput: GqlReadyCheckInput;
  Sample: Sample;
  SampleFile: GqlSampleFile;
  SampleFilterInput: GqlSampleFilterInput;
  SampleInput: GqlSampleInput;
  SampleKind: SampleKind;
  SampleKindInput: GqlSampleKindInput;
  SampleMeasurement: GqlSampleMeasurement;
  SamplePage: Omit<GqlSamplePage, 'list'> & {
    list: Array<GqlResolversParentTypes['Sample']>;
  };
  SampleSortInput: GqlSampleSortInput;
  String: Scalars['String'];
  SyncDirRevision: GqlSyncDirRevision;
  SyncElementRevision:
    | GqlResolversParentTypes['SyncDirRevision']
    | GqlResolversParentTypes['SyncFileRevision'];
  SyncFileRevision: GqlSyncFileRevision;
  SyncTreeRevision: GqlSyncTreeRevision;
  User: User;
}>;

export type GqlActivityResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Activity'] = GqlResolversParentTypes['Activity'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ActivityFile' | 'ActivityMeasurement',
    ParentType,
    ContextType
  >;
}>;

export type GqlActivityFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['ActivityFile'] = GqlResolversParentTypes['ActivityFile'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  fileId?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlActivityMeasurementResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['ActivityMeasurement'] = GqlResolversParentTypes['ActivityMeasurement'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  measurementId?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  measurementType?: Resolver<
    GqlResolversTypes['MeasurementTypes'],
    ParentType,
    ContextType
  >;
  type?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface GqlDateTimeScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GqlDirectoryEntryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['DirectoryEntry'] = GqlResolversParentTypes['DirectoryEntry'],
> = ResolversObject<{
  path?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<
    GqlResolversTypes['DirectoryEntryType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Event'] = GqlResolversParentTypes['Event'],
> = ResolversObject<{
  createdAt?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  data?: Resolver<GqlResolversTypes['EventData'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  processors?: Resolver<
    Array<GqlResolversTypes['EventProcessor']>,
    ParentType,
    ContextType
  >;
  topic?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventDataResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventData'] = GqlResolversParentTypes['EventData'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<'EventDataFile', ParentType, ContextType>;
  type?: Resolver<GqlResolversTypes['EventDataType'], ParentType, ContextType>;
}>;

export type GqlEventDataFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventDataFile'] = GqlResolversParentTypes['EventDataFile'],
> = ResolversObject<{
  file?: Resolver<GqlResolversTypes['EventFile'], ParentType, ContextType>;
  fileId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<GqlResolversTypes['EventDataType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventFile'] = GqlResolversParentTypes['EventFile'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventHistoryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventHistory'] = GqlResolversParentTypes['EventHistory'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  processId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['EventStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventPageResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventPage'] = GqlResolversParentTypes['EventPage'],
> = ResolversObject<{
  list?: Resolver<Array<GqlResolversTypes['Event']>, ParentType, ContextType>;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventProcessorResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventProcessor'] = GqlResolversParentTypes['EventProcessor'],
> = ResolversObject<{
  history?: Resolver<
    Array<GqlResolversTypes['EventHistory']>,
    ParentType,
    ContextType
  >;
  processorId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFileContentResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FileContent'] = GqlResolversParentTypes['FileContent'],
> = ResolversObject<{
  content?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFileSyncOptionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FileSyncOption'] = GqlResolversParentTypes['FileSyncOption'],
> = ResolversObject<{
  enabled?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  maxDepth?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  patterns?: Resolver<
    Array<GqlResolversTypes['Pattern']>,
    ParentType,
    ContextType
  >;
  readyChecks?: Resolver<
    Array<GqlResolversTypes['ReadyCheck']>,
    ParentType,
    ContextType
  >;
  root?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFilesFlatPageResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FilesFlatPage'] = GqlResolversParentTypes['FilesFlatPage'],
> = ResolversObject<{
  list?: Resolver<
    Array<GqlResolversTypes['SyncFileRevision']>,
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface GqlJsonScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface GqlJsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type GqlMeasurementResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Measurement'] = GqlResolversParentTypes['Measurement'],
> = ResolversObject<{
  createdAt?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  derived?: Resolver<Maybe<GqlResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  eventId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  file?: Resolver<
    Maybe<GqlResolversTypes['MeasurementFile']>,
    ParentType,
    ContextType
  >;
  fileId?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  sampleCode?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    GqlResolversTypes['MeasurementTypes'],
    ParentType,
    ContextType
  >;
  username?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlMeasurementFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['MeasurementFile'] = GqlResolversParentTypes['MeasurementFile'],
> = ResolversObject<{
  downloadUrl?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlMeasurementPageResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['MeasurementPage'] = GqlResolversParentTypes['MeasurementPage'],
> = ResolversObject<{
  list?: Resolver<
    Array<GqlResolversTypes['Measurement']>,
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlMutationResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation'],
> = ResolversObject<{
  createFileSyncOption?: Resolver<
    GqlResolversTypes['FileSyncOption'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateFileSyncOptionArgs, 'input'>
  >;
  createSample?: Resolver<
    GqlResolversTypes['Sample'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateSampleArgs, 'input'>
  >;
  createSampleKind?: Resolver<
    GqlResolversTypes['SampleKind'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationCreateSampleKindArgs, 'input'>
  >;
  deleteFileSyncOption?: Resolver<
    Array<GqlResolversTypes['FileSyncOption']>,
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeleteFileSyncOptionArgs, 'input'>
  >;
  editFileSyncOption?: Resolver<
    GqlResolversTypes['FileSyncOption'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationEditFileSyncOptionArgs, 'input'>
  >;
  updateSample?: Resolver<
    GqlResolversTypes['Sample'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateSampleArgs, 'id' | 'input'>
  >;
  updateSampleKind?: Resolver<
    GqlResolversTypes['SampleKind'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationUpdateSampleKindArgs, 'id' | 'input'>
  >;
}>;

export type GqlPaginationResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Pagination'] = GqlResolversParentTypes['Pagination'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'EventPage' | 'FilesFlatPage' | 'MeasurementPage' | 'SamplePage',
    ParentType,
    ContextType
  >;
  list?: Resolver<
    Array<GqlResolversTypes['PaginationNode']>,
    ParentType,
    ContextType
  >;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GqlPaginationNodeResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['PaginationNode'] = GqlResolversParentTypes['PaginationNode'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Event' | 'Measurement' | 'Sample' | 'SyncFileRevision',
    ParentType,
    ContextType
  >;
}>;

export type GqlPatternResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Pattern'] = GqlResolversParentTypes['Pattern'],
> = ResolversObject<{
  pattern?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<GqlResolversTypes['PatternType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlQueryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query'],
> = ResolversObject<{
  directoryTree?: Resolver<
    Array<GqlResolversTypes['DirectoryEntry']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryDirectoryTreeArgs, 'root'>
  >;
  event?: Resolver<
    GqlResolversTypes['Event'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryEventArgs, 'id'>
  >;
  events?: Resolver<
    GqlResolversTypes['EventPage'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryEventsArgs, never>
  >;
  fileByPath?: Resolver<
    GqlResolversTypes['FileContent'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFileByPathArgs, 'path'>
  >;
  fileSyncOption?: Resolver<
    GqlResolversTypes['FileSyncOption'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFileSyncOptionArgs, 'id'>
  >;
  fileSyncOptions?: Resolver<
    Array<GqlResolversTypes['FileSyncOption']>,
    ParentType,
    ContextType
  >;
  filesByConfig?: Resolver<
    GqlResolversTypes['SyncTreeRevision'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFilesByConfigArgs, 'configId' | 'path'>
  >;
  filesByConfigFlat?: Resolver<
    GqlResolversTypes['FilesFlatPage'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFilesByConfigFlatArgs, 'id'>
  >;
  measurement?: Resolver<
    GqlResolversTypes['Measurement'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryMeasurementArgs, 'id' | 'type'>
  >;
  measurements?: Resolver<
    GqlResolversTypes['MeasurementPage'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryMeasurementsArgs, 'type'>
  >;
  readyChecks?: Resolver<
    Array<GqlResolversTypes['ReadyCheckDescriptor']>,
    ParentType,
    ContextType
  >;
  sample?: Resolver<
    GqlResolversTypes['Sample'],
    ParentType,
    ContextType,
    RequireFields<GqlQuerySampleArgs, 'id'>
  >;
  sampleKind?: Resolver<
    GqlResolversTypes['SampleKind'],
    ParentType,
    ContextType,
    RequireFields<GqlQuerySampleKindArgs, 'id'>
  >;
  samples?: Resolver<
    GqlResolversTypes['SamplePage'],
    ParentType,
    ContextType,
    RequireFields<GqlQuerySamplesArgs, never>
  >;
  users?: Resolver<Array<GqlResolversTypes['User']>, ParentType, ContextType>;
}>;

export type GqlReadyCheckResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['ReadyCheck'] = GqlResolversParentTypes['ReadyCheck'],
> = ResolversObject<{
  name?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlReadyCheckDescriptorResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['ReadyCheckDescriptor'] = GqlResolversParentTypes['ReadyCheckDescriptor'],
> = ResolversObject<{
  hasArg?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSampleResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Sample'] = GqlResolversParentTypes['Sample'],
> = ResolversObject<{
  attachments?: Resolver<
    Array<GqlResolversTypes['SampleFile']>,
    ParentType,
    ContextType
  >;
  children?: Resolver<
    Maybe<Array<GqlResolversTypes['Sample']>>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<GqlResolversTypes['SampleKind'], ParentType, ContextType>;
  labels?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  measurements?: Resolver<
    Array<GqlResolversTypes['SampleMeasurement']>,
    ParentType,
    ContextType
  >;
  meta?: Resolver<GqlResolversTypes['JSON'], ParentType, ContextType>;
  parent?: Resolver<
    Maybe<GqlResolversTypes['Sample']>,
    ParentType,
    ContextType
  >;
  project?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  sampleCode?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  title?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<GqlResolversTypes['User']>, ParentType, ContextType>;
  uuid10?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSampleFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SampleFile'] = GqlResolversParentTypes['SampleFile'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  downloadUrl?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSampleKindResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SampleKind'] = GqlResolversParentTypes['SampleKind'],
> = ResolversObject<{
  color?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<GqlResolversTypes['String']>, ParentType, ContextType>;
  schema?: Resolver<GqlResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSampleMeasurementResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SampleMeasurement'] = GqlResolversParentTypes['SampleMeasurement'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSamplePageResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SamplePage'] = GqlResolversParentTypes['SamplePage'],
> = ResolversObject<{
  list?: Resolver<Array<GqlResolversTypes['Sample']>, ParentType, ContextType>;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSyncDirRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncDirRevision'] = GqlResolversParentTypes['SyncDirRevision'],
> = ResolversObject<{
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSyncElementRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncElementRevision'] = GqlResolversParentTypes['SyncElementRevision'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'SyncDirRevision' | 'SyncFileRevision',
    ParentType,
    ContextType
  >;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
}>;

export type GqlSyncFileRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncFileRevision'] = GqlResolversParentTypes['SyncFileRevision'],
> = ResolversObject<{
  countRevisions?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  downloadUrl?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['FileStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSyncTreeRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncTreeRevision'] = GqlResolversParentTypes['SyncTreeRevision'],
> = ResolversObject<{
  _id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  dirs?: Resolver<
    Array<GqlResolversTypes['SyncDirRevision']>,
    ParentType,
    ContextType
  >;
  files?: Resolver<
    Array<GqlResolversTypes['SyncFileRevision']>,
    ParentType,
    ContextType
  >;
  ignoredFiles?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUserResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['User'] = GqlResolversParentTypes['User'],
> = ResolversObject<{
  authMethods?: Resolver<
    GqlResolversTypes['JSONObject'],
    ParentType,
    ContextType
  >;
  emails?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  firstName?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  role?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlResolvers<ContextType = ApolloBaseContext> = ResolversObject<{
  Activity?: GqlActivityResolvers<ContextType>;
  ActivityFile?: GqlActivityFileResolvers<ContextType>;
  ActivityMeasurement?: GqlActivityMeasurementResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DirectoryEntry?: GqlDirectoryEntryResolvers<ContextType>;
  Event?: GqlEventResolvers<ContextType>;
  EventData?: GqlEventDataResolvers<ContextType>;
  EventDataFile?: GqlEventDataFileResolvers<ContextType>;
  EventFile?: GqlEventFileResolvers<ContextType>;
  EventHistory?: GqlEventHistoryResolvers<ContextType>;
  EventPage?: GqlEventPageResolvers<ContextType>;
  EventProcessor?: GqlEventProcessorResolvers<ContextType>;
  FileContent?: GqlFileContentResolvers<ContextType>;
  FileSyncOption?: GqlFileSyncOptionResolvers<ContextType>;
  FilesFlatPage?: GqlFilesFlatPageResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Measurement?: GqlMeasurementResolvers<ContextType>;
  MeasurementFile?: GqlMeasurementFileResolvers<ContextType>;
  MeasurementPage?: GqlMeasurementPageResolvers<ContextType>;
  Mutation?: GqlMutationResolvers<ContextType>;
  Pagination?: GqlPaginationResolvers<ContextType>;
  PaginationNode?: GqlPaginationNodeResolvers<ContextType>;
  Pattern?: GqlPatternResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  ReadyCheck?: GqlReadyCheckResolvers<ContextType>;
  ReadyCheckDescriptor?: GqlReadyCheckDescriptorResolvers<ContextType>;
  Sample?: GqlSampleResolvers<ContextType>;
  SampleFile?: GqlSampleFileResolvers<ContextType>;
  SampleKind?: GqlSampleKindResolvers<ContextType>;
  SampleMeasurement?: GqlSampleMeasurementResolvers<ContextType>;
  SamplePage?: GqlSamplePageResolvers<ContextType>;
  SyncDirRevision?: GqlSyncDirRevisionResolvers<ContextType>;
  SyncElementRevision?: GqlSyncElementRevisionResolvers<ContextType>;
  SyncFileRevision?: GqlSyncFileRevisionResolvers<ContextType>;
  SyncTreeRevision?: GqlSyncTreeRevisionResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
}>;
