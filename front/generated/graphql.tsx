import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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
};

export type MutationCreateFileSyncOptionArgs = {
  input: NewFileSyncOptionInput;
};

export type MutationEditFileSyncOptionArgs = {
  input: EditFileSyncOptionInput;
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

export type AuthMethods = {
  __typename?: 'AuthMethods';
  local?: Maybe<Scalars['String']>;
  ldap?: Maybe<Scalars['String']>;
  oidc_azure?: Maybe<Scalars['String']>;
  oidc_google?: Maybe<Scalars['String']>;
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

export type AuthMethodsFragment = { __typename?: 'AuthMethods' } & Pick<
  AuthMethods,
  'local' | 'ldap' | 'oidc_azure' | 'oidc_google'
>;

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  users: Array<
    Pick<
      User,
      'id' | 'lastName' | 'firstName' | 'emails' | 'role'
    > & {
        authMethods?: Maybe<
          { __typename?: 'AuthMethods' } & AuthMethodsFragment
        >;
      }
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
export const UsersDocument = gql`
  query Users {
    users {
      id
      lastName
      firstName
      emails
      role
      authMethods {
        ...authMethods
      }
    }
  }
  ${AuthMethodsFragmentDoc}
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
  return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    baseOptions,
  );
}
export function useUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    baseOptions,
  );
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
