import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';

import { API_URL } from '../env';
import introspectionQueryResultData from '../generated/fragmentTypes';

const cache = new InMemoryCache({
  possibleTypes: introspectionQueryResultData.possibleTypes,
});

const graphqlUrl = `${API_URL}/graphql`;

export const client = new ApolloClient({
  uri: graphqlUrl,
  credentials: 'include',
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
          // eslint-disable-next-line no-console
          console.error('[GraphQL error]', JSON.stringify(error, null, 2));
        });

        if (networkError) {
          // eslint-disable-next-line no-console
          console.error('Network error', networkError);
        }
      }
    }),
    createUploadLink({
      uri: graphqlUrl,
      credentials: 'include',
    }),
  ]),
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
