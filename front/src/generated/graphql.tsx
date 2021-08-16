import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
  readyChecks: Array<ReadyCheckInput>;
};

export type Event = {
  id: Scalars['String'];
  topic: Scalars['String'];
  data: EventData;
  processors: Array<EventProcessor>;
};

export type EventData = {
  type: EventDataType;
};

export type EventDataFile = {
  type: EventDataType;
  fileId: Scalars['String'];
};

export enum EventDataType {
  FILE = 'file',
}

export type EventHistory = {
  status: EventStatus;
  date: Scalars['DateTime'];
  message?: Maybe<Scalars['String']>;
};

export type EventProcessor = {
  processorId: Scalars['String'];
  history: Array<EventHistory>;
};

export enum EventStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type FileContent = {
  filename: Scalars['String'];
  size: Scalars['Int'];
  content: Scalars['String'];
};

export enum FileStatus {
  PENDING = 'pending',
  IMPORTING = 'importing',
  IMPORTED = 'imported',
  IMPORT_FAIL = 'import_fail',
}

export type FileSyncOption = {
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<Pattern>;
  readyChecks: Array<ReadyCheck>;
};

export type FileSyncOptionPatternInput = {
  type: PatternType;
  pattern: Scalars['String'];
};

export type FilesFilterInput = {
  minSize?: Maybe<Scalars['Int']>;
  maxSize?: Maybe<Scalars['Int']>;
  minDate?: Maybe<Scalars['DateTime']>;
  maxDate?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Array<FileStatus>>;
};

export type FilesFlatPage = {
  files: Array<SyncFileRevision>;
  totalCount: Scalars['Int'];
};

export enum FilesSortField {
  CREATIONDATE = 'creationDate',
  MODIFICATIONDATE = 'modificationDate',
  DATE = 'date',
  SIZE = 'size',
  FILENAME = 'filename',
}

export type FilesSortInput = {
  direction: SortDirection;
  field: FilesSortField;
};

export type Mutation = {
  createFileSyncOption: FileSyncOption;
  editFileSyncOption: FileSyncOption;
  deleteFileSyncOption: Array<FileSyncOption>;
};

export type MutationCreateFileSyncOptionArgs = {
  input: NewFileSyncOptionInput;
};

export type MutationEditFileSyncOptionArgs = {
  input: EditFileSyncOptionInput;
};

export type MutationDeleteFileSyncOptionArgs = {
  input: DeleteFileSyncOptionInput;
};

export type NewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
  readyChecks: Array<ReadyCheckInput>;
};

export type Pattern = {
  type: PatternType;
  pattern: Scalars['String'];
};

export enum PatternType {
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export type Query = {
  users: Array<User>;
  eventsByTopic: Array<Event>;
  eventsByFileId: Array<Event>;
  directoryTree: Array<DirectoryEntry>;
  fileByPath: FileContent;
  filesByConfig: SyncTreeRevision;
  filesByConfigFlat: FilesFlatPage;
  fileSyncOptions: Array<FileSyncOption>;
  fileSyncOption: FileSyncOption;
  readyChecks: Array<ReadyCheckDescriptor>;
};

export type QueryEventsByTopicArgs = {
  topic: Scalars['String'];
};

export type QueryEventsByFileIdArgs = {
  fileId: Scalars['String'];
};

export type QueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type QueryFileByPathArgs = {
  path: Scalars['String'];
};

export type QueryFilesByConfigArgs = {
  configId: Scalars['String'];
  path: Array<Scalars['String']>;
};

export type QueryFilesByConfigFlatArgs = {
  id: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<FilesFilterInput>;
  sortBy?: Maybe<FilesSortInput>;
};

export type QueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type ReadyCheck = {
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ReadyCheckDescriptor = {
  name: Scalars['String'];
  hasArg: Scalars['Boolean'];
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
  id: Scalars['String'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  date: Scalars['DateTime'];
  path: Array<Scalars['String']>;
};

export type SyncElementRevision = {
  id: Scalars['String'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  date: Scalars['DateTime'];
  path: Array<Scalars['String']>;
};

export type SyncFileRevision = SyncElementRevision & {
  id: Scalars['String'];
  countRevisions: Scalars['Int'];
  size: Scalars['Int'];
  relativePath: Scalars['String'];
  status: FileStatus;
  date: Scalars['DateTime'];
  downloadUrl: Scalars['String'];
  path: Array<Scalars['String']>;
  filename: Scalars['String'];
};

export type SyncTreeRevision = {
  _id: Scalars['String'];
  files: Array<SyncFileRevision>;
  dirs: Array<SyncDirRevision>;
};

export type User = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emails: Array<Scalars['String']>;
  role: Scalars['String'];
  authMethods: Scalars['JSONObject'];
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  users: Array<
    Pick<
      User,
      'id' | 'lastName' | 'firstName' | 'emails' | 'role' | 'authMethods'
    >
  >;
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
