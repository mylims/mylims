import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import User from './Models/User';
import { FileSyncOption } from '../addons/file-sync/Models/FileSyncOption';
import { SyncFile } from '../addons/file-sync/Models/SyncFile';
import { ApolloBaseContext } from '@ioc:Apollo/Config';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  patterns: Array<GqlFileSyncOptionPatternInput>;
  readyChecks: Array<GqlReadyCheckInput>;
};

export type GqlFileContent = {
  __typename?: 'FileContent';
  filename: Scalars['String'];
  size: Scalars['Int'];
  content: Scalars['String'];
};

export type GqlFileSyncOption = {
  __typename?: 'FileSyncOption';
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlPattern>;
  readyChecks: Array<GqlReadyCheck>;
};

export type GqlFileSyncOptionPatternInput = {
  type: GqlPatternType;
  pattern: Scalars['String'];
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
  directoryTree: Array<GqlDirectoryEntry>;
  fileByPath: GqlFileContent;
  fileSyncOptions: Array<GqlFileSyncOption>;
  fileSyncOption: GqlFileSyncOption;
  readyChecks: Array<GqlReadyCheckDescriptor>;
};

export type GqlQueryDirectoryTreeArgs = {
  root: Scalars['String'];
};

export type GqlQueryFileByPathArgs = {
  path: Scalars['String'];
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
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  DirectoryEntry: ResolverTypeWrapper<GqlDirectoryEntry>;
  String: ResolverTypeWrapper<Scalars['String']>;
  DirectoryEntryType: GqlDirectoryEntryType;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  FileContent: ResolverTypeWrapper<GqlFileContent>;
  FileSyncOption: ResolverTypeWrapper<FileSyncOption>;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
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
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = ResolversObject<{
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  ID: Scalars['ID'];
  DirectoryEntry: GqlDirectoryEntry;
  String: Scalars['String'];
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  FileContent: GqlFileContent;
  FileSyncOption: FileSyncOption;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  Mutation: {};
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  Pattern: GqlPattern;
  Query: {};
  ReadyCheck: GqlReadyCheck;
  ReadyCheckDescriptor: GqlReadyCheckDescriptor;
  ReadyCheckInput: GqlReadyCheckInput;
  User: User;
}>;

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
  DirectoryEntry?: GqlDirectoryEntryResolvers<ContextType>;
  FileContent?: GqlFileContentResolvers<ContextType>;
  FileSyncOption?: GqlFileSyncOptionResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: GqlMutationResolvers<ContextType>;
  Pattern?: GqlPatternResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  ReadyCheck?: GqlReadyCheckResolvers<ContextType>;
  ReadyCheckDescriptor?: GqlReadyCheckDescriptorResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
}>;
