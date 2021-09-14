import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
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
const defaultOptions = {};
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

/** Main event type */
export type Event = {
  _id: Scalars['String'];
  data: EventData;
  processors: Array<EventProcessor>;
  topic: Scalars['String'];
};

export type EventData = {
  type: EventDataType;
};

export type EventDataFile = EventData & {
  fileId: Scalars['String'];
  type: EventDataType;
};

export enum EventDataType {
  FILE = 'file',
}

export type EventFilterInput = {
  fileId?: Maybe<Scalars['String']>;
  processorId?: Maybe<Scalars['String']>;
  status?: Maybe<Array<EventStatus>>;
  topic?: Maybe<Scalars['String']>;
};

/** Intermediary type for event data */
export type EventHistory = {
  date: Scalars['DateTime'];
  message?: Maybe<Scalars['String']>;
  processId: Scalars['String'];
  status: EventStatus;
};

export type EventPage = {
  events: Array<Event>;
  totalCount: Scalars['Int'];
};

export type EventProcessor = {
  history: Array<EventHistory>;
  processorId: Scalars['String'];
};

/** Paginated list of events */
export enum EventSortField {
  DATE = 'date',
  PROCESSORID = 'processorId',
  STATUS = 'status',
  TOPIC = 'topic',
}

export type EventSortInput = {
  direction: SortDirection;
  field: EventSortField;
};

/** Enums for event fields */
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
  maxDate?: Maybe<Scalars['DateTime']>;
  maxSize?: Maybe<Scalars['Int']>;
  minDate?: Maybe<Scalars['DateTime']>;
  minSize?: Maybe<Scalars['Int']>;
  status?: Maybe<Array<FileStatus>>;
};

export type FilesFlatPage = {
  files: Array<SyncFileRevision>;
  totalCount: Scalars['Int'];
};

export enum FilesSortField {
  CREATIONDATE = 'creationDate',
  DATE = 'date',
  FILENAME = 'filename',
  MODIFICATIONDATE = 'modificationDate',
  SIZE = 'size',
}

export type FilesSortInput = {
  direction: SortDirection;
  field: FilesSortField;
};

export type Mutation = {
  createFileSyncOption: FileSyncOption;
  deleteFileSyncOption: Array<FileSyncOption>;
  editFileSyncOption: FileSyncOption;
};

export type MutationCreateFileSyncOptionArgs = {
  input: NewFileSyncOptionInput;
};

export type MutationDeleteFileSyncOptionArgs = {
  input: DeleteFileSyncOptionInput;
};

export type MutationEditFileSyncOptionArgs = {
  input: EditFileSyncOptionInput;
};

export type NewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
  readyChecks: Array<ReadyCheckInput>;
  root: Scalars['String'];
  topics: Array<Scalars['String']>;
};

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
  events: EventPage;
  fileByPath: FileContent;
  fileSyncOption: FileSyncOption;
  fileSyncOptions: Array<FileSyncOption>;
  filesByConfig: SyncTreeRevision;
  filesByConfigFlat: FilesFlatPage;
  readyChecks: Array<ReadyCheckDescriptor>;
  users: Array<User>;
};

export type QueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type QueryEventsArgs = {
  filterBy?: Maybe<EventFilterInput>;
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<EventSortInput>;
};

export type QueryFileByPathArgs = {
  path: Scalars['String'];
};

export type QueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type QueryFilesByConfigArgs = {
  configId: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type QueryFilesByConfigFlatArgs = {
  filterBy?: Maybe<FilesFilterInput>;
  id: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  sortBy?: Maybe<FilesSortInput>;
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
  value?: Maybe<Scalars['String']>;
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
};

export type User = {
  authMethods: Scalars['JSONObject'];
  emails: Array<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  role: Scalars['String'];
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  users: Array<{
    id: string;
    lastName?: Maybe<string>;
    firstName?: Maybe<string>;
    emails: Array<string>;
    role: string;
    authMethods: any;
  }>;
};

export const UsersDocument = gql`
  query Users {
    users {
      id
      lastName
      firstName
      emails
      role
      authMethods
    }
  }
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
