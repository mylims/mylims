import { ApolloConfig, ApolloBaseContext } from '@ioc:Apollo/Config';

import { getResolvers, getSchemas } from '../app/AddonsManager';

type ApolloContext = ApolloBaseContext;

const config: ApolloConfig = {
  schemas: ['app/Schemas', ...getSchemas()],
  resolvers: ['app/Resolvers', ...getResolvers()],
  path: '/graphql',
  apolloServer: {
    introspection: true,
    context: ({ ctx }): ApolloContext => {
      return { ctx };
    },
  },
  executableSchema: {
    inheritResolversFromInterfaces: true,
  },
  playgroundSettings: {},
};

export default config;
