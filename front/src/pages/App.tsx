import '../../tailwind.css';

import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  ErrorPage,
  NotificationCenter,
  NotificationProvider,
  Spinner,
  ToastNotificationCenter,
} from '@/components/tailwind-ui';
import { useElnQuery } from '@/hooks/useElnQuery';

import AddonsContext from '../contexts/AddonsContext';
import AuthContext from '../contexts/AuthContext';
import { client } from '../graphql/apollo';

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

  const {
    isLoading: authLoading,
    data: authData = { isAuth: false },
    error: authError,
  } = useElnQuery('/auth');

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

  if (authError) {
    return (
      <NotificationProvider>
        <NotificationCenter position="bottom-right" />
        <ToastNotificationCenter position="bottom" />
        <ErrorPage subtitle="There was a little problem." title="Oooops">
          Failed to get auth status : {authError}
        </ErrorPage>
      </NotificationProvider>
    );
  }

  if (addonsLoading || authLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div>
            <Spinner className="h-10 w-10 text-danger-500" />
          </div>
          <div>Loading new eln...</div>
        </div>
      </div>
    );
  }

  return (
    <AddonsContext.Provider value={addonsData}>
      <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
    </AddonsContext.Provider>
  );
}

interface MyAppProps {
  Component: React.ComponentType<Record<string, never>> & {
    getLayout?: (
      component: React.ReactNode,
      client?: ApolloClient<NormalizedCacheObject>,
    ) => React.ReactNode;
  };
}

export default function App({ Component }: MyAppProps) {
  const getLayout = useMemo(
    () => Component.getLayout || ((page: React.ReactNode) => page),
    [Component.getLayout],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <SetupEln>{getLayout(<Component />, client)}</SetupEln>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
