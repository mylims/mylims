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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type DeleteFileSyncOptionInput = {
  id: Scalars['ID'];
};

export type EditFileSyncOptionInput = {
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<FileSyncOptionPatternInput>;
};

export type FileSyncOption = {
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<Pattern>;
};

export type FileSyncOptionPatternInput = {
  type: PatternType;
  pattern: Scalars['String'];
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
  fileSyncOptions: Array<FileSyncOption>;
  fileSyncOption: FileSyncOption;
};

export type QueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type User = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emails: Array<Scalars['String']>;
  role: Scalars['String'];
  authMethods: Scalars['JSONObject'];
};

export type FileSyncOptionFieldsFragment = Pick<
  FileSyncOption,
  'id' | 'enabled' | 'root' | 'maxDepth'
> & { patterns: Array<Pick<Pattern, 'type' | 'pattern'>> };

export type FileSyncOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type FileSyncOptionsQuery = {
  fileSyncOptions: Array<FileSyncOptionFieldsFragment>;
};

export type FileSyncOptionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type FileSyncOptionQuery = {
  fileSyncOption: FileSyncOptionFieldsFragment;
};

export type CreateFileSyncOptionMutationVariables = Exact<{
  input: NewFileSyncOptionInput;
}>;

export type CreateFileSyncOptionMutation = {
  createFileSyncOption: Pick<FileSyncOption, 'id'> &
    FileSyncOptionFieldsFragment;
};

export type EditFileSyncOptionMutationVariables = Exact<{
  input: EditFileSyncOptionInput;
}>;

export type EditFileSyncOptionMutation = {
  editFileSyncOption: Pick<FileSyncOption, 'id'> & FileSyncOptionFieldsFragment;
};

export type DeleteFileSyncOptionMutationVariables = Exact<{
  input: DeleteFileSyncOptionInput;
}>;

export type DeleteFileSyncOptionMutation = { __typename?: 'Mutation' } & {
  deleteFileSyncOption: Array<
    { __typename?: 'FileSyncOption' } & Pick<FileSyncOption, 'id'> &
      FileSyncOptionFieldsFragment
  >;
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

export const FileSyncOptionFieldsFragmentDoc = gql`
  fragment FileSyncOptionFields on FileSyncOption {
    id
    enabled
    root
    maxDepth
    patterns {
      type
      pattern
    }
  }
`;
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
export type CreateFileSyncOptionMutationResult = Apollo.MutationResult<CreateFileSyncOptionMutation>;
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
export type EditFileSyncOptionMutationResult = Apollo.MutationResult<EditFileSyncOptionMutation>;
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
export type DeleteFileSyncOptionMutationResult = Apollo.MutationResult<DeleteFileSyncOptionMutation>;
export type DeleteFileSyncOptionMutationOptions = Apollo.BaseMutationOptions<
  DeleteFileSyncOptionMutation,
  DeleteFileSyncOptionMutationVariables
>;
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
