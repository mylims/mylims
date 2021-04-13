import '../styles/globals.css';
import '../styles/tailwind.out.css';

import { ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ErrorPage,
  NotificationCenter,
  NotificationProvider,
  Spinner,
  ToastNotificationCenter,
} from '../components/tailwind-ui';
import AddonsContext from '../contexts/AddonsContext';
import { client } from '../graphql/apollo';
import { useElnQuery } from '../hooks/useElnQuery';

const queryClient = new QueryClient();

function SetupEln({ children }) {
  const {
    isLoading: addonsLoading,
    data: addonsData = [],
    error: addonsError,
  } = useElnQuery('/addons');

  if (addonsError) {
    return (
      <NotificationProvider>
        <NotificationCenter position="bottom-right" />
        <ToastNotificationCenter position="bottom" />
        <ErrorPage subtitle="There was a little problem." title="Oooops">
          Failed to load New ELN : {addonsError}
        </ErrorPage>
      </NotificationProvider>
    );
  }

  if (addonsLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col items-center">
          <div>
            <Spinner className="text-danger-500 h-10 w-10" />
          </div>
          <div>Loading new eln...</div>
        </div>
      </div>
    );
  }

  return (
    <AddonsContext.Provider value={addonsData}>
      {children}
    </AddonsContext.Provider>
  );
}

function MyApp({ Component, pageProps }) {
  const getLayout = useMemo(() => Component.getLayout || ((page) => page), [
    Component.getLayout,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <SetupEln>{getLayout(<Component {...pageProps} />)}</SetupEln>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
