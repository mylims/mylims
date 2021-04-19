import {
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import NextRouter from 'next/router';

import introspectionQueryResultData from '../generated/fragmentTypes';

const cache = new InMemoryCache({
  possibleTypes: introspectionQueryResultData.possibleTypes,
});

const graphqlUrl = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;

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
          if (
            (networkError as typeof networkError & { statusCode: number })
              .statusCode === 401
          ) {
            return new Observable((observer) => {
              NextRouter.push('/login')
                .then(() => {
                  observer.complete();
                })
                .catch((err) => observer.error(err));
            });
          }
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
