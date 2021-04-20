import '../tailwind.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ComponentType, useMemo } from 'react';
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

interface SetupElnProps {
  children: React.ReactNode;
}

function SetupEln({ children }: SetupElnProps) {
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

type MyAppProps = AppProps & {
  Component: ComponentType & {
    getLayout: (component: React.ReactNode) => React.ReactNode;
  };
};

function MyApp({ Component, pageProps }: MyAppProps) {
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
