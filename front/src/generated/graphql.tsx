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

export type Event = {
  createdAt: Scalars['DateTime'];
  data: EventData;
  id: Scalars['String'];
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
  id: Scalars['String'];
  name: Scalars['String'];
};

export type EventFilterInput = {
  fileId?: Maybe<Scalars['String']>;
  processorId?: Maybe<Scalars['String']>;
  status?: Maybe<Array<EventStatus>>;
  topic?: Maybe<Scalars['String']>;
};

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
  event: Event;
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

export type QueryEventArgs = {
  id: Scalars['String'];
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

export type EventQueryVariables = Exact<{
  id: Scalars['String'];
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
        message?: Maybe<string>;
      }>;
    }>;
  };
};

export type EventsFilteredQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<EventFilterInput>;
  sortBy?: Maybe<EventSortInput>;
}>;

export type EventsFilteredQuery = {
  events: {
    totalCount: number;
    events: Array<{
      id: string;
      topic: string;
      createdAt: any;
      data: { file: { id: string; name: string } };
      processors: Array<{
        processorId: string;
        history: Array<{
          status: EventStatus;
          date: any;
          message?: Maybe<string>;
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
  readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    readyChecks: Array<{ name: string; value?: Maybe<string> }>;
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
    events: Array<{
      id: string;
      topic: string;
      processors: Array<{
        processorId: string;
        history: Array<{
          status: EventStatus;
          date: any;
          message?: Maybe<string>;
        }>;
      }>;
    }>;
  };
};

export type FilesByConfigFlatQueryVariables = Exact<{
  id: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  filterBy?: Maybe<FilesFilterInput>;
  sortBy?: Maybe<FilesSortInput>;
}>;

export type FilesByConfigFlatQuery = {
  filesByConfigFlat: {
    totalCount: number;
    files: Array<{
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
export const EventDocument = gql`
  query Event($id: String!) {
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
export function refetchEventQuery(variables?: EventQueryVariables) {
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
      events {
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
  variables?: DirectoryTreeQueryVariables,
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
  variables?: FileSyncOptionQueryVariables,
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
  variables?: FilesByConfigQueryVariables,
) {
  return { query: FilesByConfigDocument, variables: variables };
}
export const EventsByFileIdDocument = gql`
  query EventsByFileId($id: String!) {
    events(filterBy: { fileId: $id }) {
      __typename
      events {
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
  variables?: EventsByFileIdQueryVariables,
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
      files {
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
  variables?: FilesByConfigFlatQueryVariables,
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
