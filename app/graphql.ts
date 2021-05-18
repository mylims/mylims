import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import User from './Models/User';
import FileSyncOption from '../addons/file-sync/Models/FileSyncOption';
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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type GqlQuery = {
  users: Array<GqlUser>;
  fileSyncOptions: Array<GqlFileSyncOption>;
  fileSyncOption: GqlFileSyncOption;
};

export type GqlQueryFileSyncOptionArgs = {
  id: Scalars['ID'];
};

export type GqlUser = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emails: Array<Scalars['String']>;
  role: Scalars['String'];
  authMethods: Scalars['JSONObject'];
};

export type GqlMutation = {
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

export enum GqlPatternType {
  EXCLUDE = 'exclude',
  INCLUDE = 'include',
}

export type GqlPattern = {
  type: GqlPatternType;
  pattern: Scalars['String'];
};

export type GqlFileSyncOption = {
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlPattern>;
};

export type GqlNewFileSyncOptionInput = {
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlFileSyncOptionPatternInput>;
};

export type GqlEditFileSyncOptionInput = {
  id: Scalars['ID'];
  enabled: Scalars['Boolean'];
  root: Scalars['String'];
  maxDepth: Scalars['Int'];
  patterns: Array<GqlFileSyncOptionPatternInput>;
};

export type GqlDeleteFileSyncOptionInput = {
  id: Scalars['ID'];
};

export type GqlFileSyncOptionPatternInput = {
  type: GqlPatternType;
  pattern: Scalars['String'];
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
  TArgs
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
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
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
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = ResolversObject<{
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  User: ResolverTypeWrapper<User>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  PatternType: GqlPatternType;
  Pattern: ResolverTypeWrapper<GqlPattern>;
  FileSyncOption: ResolverTypeWrapper<FileSyncOption>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = ResolversObject<{
  JSONObject: Scalars['JSONObject'];
  Query: {};
  ID: Scalars['ID'];
  User: User;
  String: Scalars['String'];
  Mutation: {};
  Pattern: GqlPattern;
  FileSyncOption: FileSyncOption;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  NewFileSyncOptionInput: GqlNewFileSyncOptionInput;
  EditFileSyncOptionInput: GqlEditFileSyncOptionInput;
  DeleteFileSyncOptionInput: GqlDeleteFileSyncOptionInput;
  FileSyncOptionPatternInput: GqlFileSyncOptionPatternInput;
}>;

export interface GqlJsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<GqlResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type GqlQueryResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Query'] = GqlResolversParentTypes['Query']
> = ResolversObject<{
  users?: Resolver<Array<GqlResolversTypes['User']>, ParentType, ContextType>;
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
}>;

export type GqlUserResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['User'] = GqlResolversParentTypes['User']
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

export type GqlMutationResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['Mutation'] = GqlResolversParentTypes['Mutation']
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
  ParentType extends GqlResolversParentTypes['Pattern'] = GqlResolversParentTypes['Pattern']
> = ResolversObject<{
  type?: Resolver<GqlResolversTypes['PatternType'], ParentType, ContextType>;
  pattern?: Resolver<GqlResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlFileSyncOptionResolvers<
  ContextType = ApolloBaseContext,
  ParentType extends GqlResolversParentTypes['FileSyncOption'] = GqlResolversParentTypes['FileSyncOption']
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GqlResolvers<ContextType = ApolloBaseContext> = ResolversObject<{
  JSONObject?: GraphQLScalarType;
  Query?: GqlQueryResolvers<ContextType>;
  User?: GqlUserResolvers<ContextType>;
  Mutation?: GqlMutationResolvers<ContextType>;
  Pattern?: GqlPatternResolvers<ContextType>;
  FileSyncOption?: GqlFileSyncOptionResolvers<ContextType>;
}>;
