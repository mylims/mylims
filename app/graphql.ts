import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import User from './Models/User';
import { FileSyncOption } from '../addons/file-sync/Models/FileSyncOption';
import { SyncFile } from '../addons/file-sync/Models/SyncFile';
import { Event } from '../addons/events/Models/Event';
import { ApolloBaseContext } from '@ioc:Apollo/Config';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
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
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  topics: Array<Scalars['String']>;
  patterns: Array<GqlFileSyncOptionPatternInput>;
  readyChecks: Array<GqlReadyCheckInput>;
};

/** Main event type */
export type GqlEvent = {
  __typename?: 'Event';
  _id: Scalars['String'];
  topic: Scalars['String'];
  data: GqlEventData;
  createdAt: Scalars['DateTime'];
  processors: Array<GqlEventProcessor>;
};

export type GqlEventData = {
  type: GqlEventDataType;
};

export type GqlEventDataFile = GqlEventData & {
  __typename?: 'EventDataFile';
  type: GqlEventDataType;
  fileId: Scalars['String'];
  file: GqlEventFile;
};

export enum GqlEventDataType {
  FILE = 'file',
}

export type GqlEventFile = {
  __typename?: 'EventFile';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GqlEventFilterInput = {
  topic?: Maybe<Scalars['String']>;
  processorId?: Maybe<Scalars['String']>;
  status?: Maybe<Array<GqlEventStatus>>;
  fileId?: Maybe<Scalars['String']>;
};

/** Intermediary type for event data */
export type GqlEventHistory = {
  __typename?: 'EventHistory';
  processId: Scalars['String'];
  status: GqlEventStatus;
  date: Scalars['DateTime'];
  message?: Maybe<Scalars['String']>;
};

export type GqlEventPage = {
  __typename?: 'EventPage';
  events: Array<GqlEvent>;
  totalCount: Scalars['Int'];
};

export type GqlEventProcessor = {
  __typename?: 'EventProcessor';
  processorId: Scalars['String'];
  history: Array<GqlEventHistory>;
};

/** Paginated list of events */
export enum GqlEventSortField {
  DATE = 'date',
  TOPIC = 'topic',
  PROCESSORID = 'processorId',
  STATUS = 'status',
  CREATEDAT = 'createdAt',
}

export type GqlEventSortInput = {
  direction: GqlSortDirection;
  field: GqlEventSortField;
};

/** Enums for event fields */
export enum GqlEventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type GqlFileContent = {
  __typename?: 'FileContent';
  filename: Scalars['String'];
  size: Scalars['Int'];
  content: Scalars['String'];
};

export enum GqlFileStatus {
  PENDING = 'pending',
  IMPORTING = 'importing',
  IMPORTED = 'imported',
  IMPORT_FAIL = 'import_fail',
}

export type GqlFileSyncOption = {
  __typename?: 'FileSyncOption';
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlPattern>;
  readyChecks: Array<GqlReadyCheck>;
  topics: Array<Scalars['String']>;
};

export type GqlFileSyncOptionPatternInput = {
  type: GqlPatternType;
  pattern: Scalars['String'];
};

export type GqlFilesFilterInput = {
  minSize?: Maybe<Scalars['Int']>;
  maxSize?: Maybe<Scalars['Int']>;
  minDate?: Maybe<Scalars['DateTime']>;
  maxDate?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Array<GqlFileStatus>>;
};

export type GqlFilesFlatPage = {
  __typename?: 'FilesFlatPage';
  files: Array<GqlSyncFileRevision>;
  totalCount: Scalars['Int'];
};

export enum GqlFilesSortField {
  CREATIONDATE = 'creationDate',
  MODIFICATIONDATE = 'modificationDate',
  DATE = 'date',
  SIZE = 'size',
  FILENAME = 'filename',
}

export type GqlFilesSortInput = {
  direction: GqlSortDirection;
  field: GqlFilesSortField;
};

export type GqlMutation = {
  __typename?: 'Mutation';
  createFileSyncOption: GqlFileSyncOption;
  editFileSyncOption: GqlFileSyncOption;
  deleteFileSyncOption: Array<GqlFileSyncOption>;
};

export type GqlMutationCreateFileSyncOptionArgs = {
  input: GqlNewFileSyncOptionInput;
};

export type GqlMutationEditFileSyncOptionArgs = {
  input: GqlEditFileSyncOptionInput;
};

export type GqlMutationDeleteFileSyncOptionArgs = {
  input: GqlDeleteFileSyncOptionInput;
};

export type GqlNewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  topics: Array<Scalars['String']>;
  patterns: Array<GqlFileSyncOptionPatternInput>;
  readyChecks: Array<GqlReadyCheckInput>;
};

export type GqlPattern = {
  __typename?: 'Pattern';
  type: GqlPatternType;
  pattern: Scalars['String'];
};

export enum GqlPatternType {
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export type GqlQuery = {
  __typename?: 'Query';
  users: Array<GqlUser>;
  events: GqlEventPage;
  directoryTree: Array<GqlDirectoryEntry>;
  fileByPath: GqlFileContent;
  filesByConfig: GqlSyncTreeRevision;
  filesByConfigFlat: GqlFilesFlatPage;
  fileSyncOptions: Array<GqlFileSyncOption>;
  fileSyncOption: GqlFileSyncOption;
  readyChecks: Array<GqlReadyCheckDescriptor>;
};

export type GqlQueryEventsArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<GqlEventFilterInput>;
  sortBy?: Maybe<GqlEventSortInput>;
};

export type GqlQueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type GqlQueryFileByPathArgs = {
  path: Scalars['String'];
};

export type GqlQueryFilesByConfigArgs = {
  configId: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type GqlQueryFilesByConfigFlatArgs = {
  id: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<GqlFilesFilterInput>;
  sortBy?: Maybe<GqlFilesSortInput>;
};

export type GqlQueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type GqlReadyCheck = {
  __typename?: 'ReadyCheck';
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type GqlReadyCheckDescriptor = {
  __typename?: 'ReadyCheckDescriptor';
  name: Scalars['String'];
  hasArg: Scalars['Boolean'];
};

export type GqlReadyCheckInput = {
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export enum GqlSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type GqlSyncDirRevision = GqlSyncElementRevision & {
  __typename?: 'SyncDirRevision';
  id: Scalars['String'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  date: Scalars['DateTime'];
  path: Array<Scalars['String']>;
};

export type GqlSyncElementRevision = {
  id: Scalars['String'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  date: Scalars['DateTime'];
  path: Array<Scalars['String']>;
};

export type GqlSyncFileRevision = GqlSyncElementRevision & {
  __typename?: 'SyncFileRevision';
  id: Scalars['String'];
  countRevisions: Scalars['Int'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  status: GqlFileStatus;
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  path: Array<Scalars['String']>;
  filename: Scalars['String'];
};

export type GqlSyncTreeRevision = {
  __typename?: 'SyncTreeRevision';
  _id: Scalars['String'];
  files: Array<GqlSyncFileRevision>;
  dirs: Array<GqlSyncDirRevision>;
};

export type GqlUser = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emails: Array<Scalars['String']>;
  role: Scalars['String'];
  authMethods: Scalars['JSONObject'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  DirectoryEntry: ResolverTypeWrapper<GqlDirectoryEntry>;
  String: ResolverTypeWrapper<Scalars['String']>;
  DirectoryEntryType: GqlDirectoryEntryType;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Event: ResolverTypeWrapper<Event>;
  EventData: GqlResolversTypes['EventDataFile'];
  EventDataFile: ResolverTypeWrapper<GqlEventDataFile>;
  EventDataType: GqlEventDataType;
  EventFile: ResolverTypeWrapper<GqlEventFile>;
  EventFilterInput: GqlEventFilterInput;
  EventHistory: ResolverTypeWrapper<GqlEventHistory>;
  EventPage: ResolverTypeWrapper<
    Omit<GqlEventPage, 'events'> & { events: Array<GqlResolversTypes['Event']> }
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
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  Pattern: ResolverTypeWrapper<GqlPattern>;
  PatternType: GqlPatternType;
  Query: ResolverTypeWrapper<{}>;
  ReadyCheck: ResolverTypeWrapper<GqlReadyCheck>;
  ReadyCheckDescriptor: ResolverTypeWrapper<GqlReadyCheckDescriptor>;
  ReadyCheckInput: GqlReadyCheckInput;
  SortDirection: GqlSortDirection;
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
  DateTime: Scalars['DateTime'];
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  ID: Scalars['ID'];
  DirectoryEntry: GqlDirectoryEntry;
  String: Scalars['String'];
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  Event: Event;
  EventData: GqlResolversParentTypes['EventDataFile'];
  EventDataFile: GqlEventDataFile;
  EventFile: GqlEventFile;
  EventFilterInput: GqlEventFilterInput;
  EventHistory: GqlEventHistory;
  EventPage: Omit<GqlEventPage, 'events'> & {
    events: Array<GqlResolversParentTypes['Event']>;
  };
  EventProcessor: GqlEventProcessor;
  EventSortInput: GqlEventSortInput;
  FileContent: GqlFileContent;
  FileSyncOption: FileSyncOption;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
  FilesFilterInput: GqlFilesFilterInput;
  FilesFlatPage: GqlFilesFlatPage;
  FilesSortInput: GqlFilesSortInput;
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  Pattern: GqlPattern;
  Query: {};
  ReadyCheck: GqlReadyCheck;
  ReadyCheckDescriptor: GqlReadyCheckDescriptor;
  ReadyCheckInput: GqlReadyCheckInput;
  SyncDirRevision: GqlSyncDirRevision;
  SyncElementRevision:
    | GqlResolversParentTypes['SyncDirRevision']
    | GqlResolversParentTypes['SyncFileRevision'];
  SyncFileRevision: GqlSyncFileRevision;
  SyncTreeRevision: GqlSyncTreeRevision;
  User: User;
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
  _id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  topic?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  data?: Resolver<GqlResolversTypes['EventData'], ParentType, ContextType>;
  createdAt?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  processors?: Resolver<
    Array<GqlResolversTypes['EventProcessor']>,
    ParentType,
    ContextType
  >;
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
  type?: Resolver<GqlResolversTypes['EventDataType'], ParentType, ContextType>;
  fileId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  file?: Resolver<GqlResolversTypes['EventFile'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventFileResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventFile'] = GqlResolversParentTypes['EventFile'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventHistoryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventHistory'] = GqlResolversParentTypes['EventHistory'],
> = ResolversObject<{
  processId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['EventStatus'], ParentType, ContextType>;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventPageResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventPage'] = GqlResolversParentTypes['EventPage'],
> = ResolversObject<{
  events?: Resolver<Array<GqlResolversTypes['Event']>, ParentType, ContextType>;
  totalCount?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlEventProcessorResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['EventProcessor'] = GqlResolversParentTypes['EventProcessor'],
> = ResolversObject<{
  processorId?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  history?: Resolver<
    Array<GqlResolversTypes['EventHistory']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFileContentResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FileContent'] = GqlResolversParentTypes['FileContent'],
> = ResolversObject<{
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  content?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFileSyncOptionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FileSyncOption'] = GqlResolversParentTypes['FileSyncOption'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  enabled?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  root?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
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
  files?: Resolver<
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
  editFileSyncOption?: Resolver<
    GqlResolversTypes['FileSyncOption'],
    ParentType,
    ContextType,
    RequireFields<GqlMutationEditFileSyncOptionArgs, 'input'>
  >;
  deleteFileSyncOption?: Resolver<
    Array<GqlResolversTypes['FileSyncOption']>,
    ParentType,
    ContextType,
    RequireFields<GqlMutationDeleteFileSyncOptionArgs, 'input'>
  >;
}>;

export type GqlPatternResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Pattern'] = GqlResolversParentTypes['Pattern'],
> = ResolversObject<{
  type?: Resolver<GqlResolversTypes['PatternType'], ParentType, ContextType>;
  pattern?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlQueryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query'],
> = ResolversObject<{
  users?: Resolver<Array<GqlResolversTypes['User']>, ParentType, ContextType>;
  events?: Resolver<
    GqlResolversTypes['EventPage'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryEventsArgs, never>
  >;
  directoryTree?: Resolver<
    Array<GqlResolversTypes['DirectoryEntry']>,
    ParentType,
    ContextType,
    RequireFields<GqlQueryDirectoryTreeArgs, 'root'>
  >;
  fileByPath?: Resolver<
    GqlResolversTypes['FileContent'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFileByPathArgs, 'path'>
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
  fileSyncOptions?: Resolver<
    Array<GqlResolversTypes['FileSyncOption']>,
    ParentType,
    ContextType
  >;
  fileSyncOption?: Resolver<
    GqlResolversTypes['FileSyncOption'],
    ParentType,
    ContextType,
    RequireFields<GqlQueryFileSyncOptionArgs, 'id'>
  >;
  readyChecks?: Resolver<
    Array<GqlResolversTypes['ReadyCheckDescriptor']>,
    ParentType,
    ContextType
  >;
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
  name?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  hasArg?: Resolver<GqlResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSyncDirRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncDirRevision'] = GqlResolversParentTypes['SyncDirRevision'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
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
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
}>;

export type GqlSyncFileRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncFileRevision'] = GqlResolversParentTypes['SyncFileRevision'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  countRevisions?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  size?: Resolver<GqlResolversTypes['Int'], ParentType, ContextType>;
  relativePath?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<GqlResolversTypes['FileStatus'], ParentType, ContextType>;
  date?: Resolver<GqlResolversTypes['DateTime'], ParentType, ContextType>;
  downloadUrl?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Array<GqlResolversTypes['String']>, ParentType, ContextType>;
  filename?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlSyncTreeRevisionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['SyncTreeRevision'] = GqlResolversParentTypes['SyncTreeRevision'],
> = ResolversObject<{
  _id?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  files?: Resolver<
    Array<GqlResolversTypes['SyncFileRevision']>,
    ParentType,
    ContextType
  >;
  dirs?: Resolver<
    Array<GqlResolversTypes['SyncDirRevision']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlUserResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['User'] = GqlResolversParentTypes['User'],
> = ResolversObject<{
  id?: Resolver<GqlResolversTypes['ID'], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<
    Maybe<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  emails?: Resolver<
    Array<GqlResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  role?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  authMethods?: Resolver<
    GqlResolversTypes['JSONObject'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlResolvers<ContextType = ApolloBaseContext> = ResolversObject<{
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
  Mutation?: GqlMutationResolvers<ContextType>;
  Pattern?: GqlPatternResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  ReadyCheck?: GqlReadyCheckResolvers<ContextType>;
  ReadyCheckDescriptor?: GqlReadyCheckDescriptorResolvers<ContextType>;
  SyncDirRevision?: GqlSyncDirRevisionResolvers<ContextType>;
  SyncElementRevision?: GqlSyncElementRevisionResolvers<ContextType>;
  SyncFileRevision?: GqlSyncFileRevisionResolvers<ContextType>;
  SyncTreeRevision?: GqlSyncTreeRevisionResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
}>;
