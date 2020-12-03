import { ApolloConfig, ApolloBaseContext } from '@ioc:Apollo/Config';

import { getProviders, getSchemas } from '../app/AddonsManager';

type ApolloContext = ApolloBaseContext;

const config: ApolloConfig = {
  schemas: ['app/Schemas', ...getSchemas()],
  resolvers: ['app/Resolvers', ...getProviders()],
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
