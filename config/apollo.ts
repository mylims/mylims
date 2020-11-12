import { ApolloConfig, ApolloBaseContext } from '@ioc:Apollo/Config';

type ApolloContext = ApolloBaseContext;

const config: ApolloConfig = {
  schemas: 'app/Schemas',
  resolvers: 'app/Resolvers',
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
};

export default config;
