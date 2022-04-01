import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType, Spinner } from '@/components/tailwind-ui';
import {
  useFilesByConfigQuery,
  FileSyncOptionDocument,
} from '@/generated/graphql';
import { useQuery } from '@/hooks/useQuery';

import { FilterTable } from './FilterTable';
import TableFilesSync from './TableFilesSync';

export default function ListFiles() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { page } = useQuery();

  if (id === undefined) {
    void navigate('../../list');
    return null;
  }

  if (page) {
    return <FilterTable id={id} />;
  } else {
    return <NestedTable id={id} />;
  }
}

function NestedTable({ id }: { id: string }) {
  const { data, loading, error } = useFilesByConfigQuery({
    variables: { id, path: [] },
  });

  if (error) {
    return (
      <Alert
        title="Error while fetching file sync option"
        type={AlertType.ERROR}
      >
        Unexpected error {error.message}
      </Alert>
    );
  }

  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  return <TableFilesSync data={data} id={id} />;
}

ListFiles.getLayout = (
  page: React.ReactNode,
  client?: ApolloClient<NormalizedCacheObject>,
) => {
  return <Layout page={page} client={client} />;
};

const Layout = ({
  page,
  client,
}: {
  page: React.ReactNode;
  client?: ApolloClient<NormalizedCacheObject>;
}) => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('Table of filtered files');
  const query = client?.query({
    query: FileSyncOptionDocument,
    variables: { id },
  });

  useEffect(() => {
    if (query) {
      query
        .then(({ data }) => {
          if (data) setTitle(data.fileSyncOption.root);
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    }
  }, [id, query]);

  return <ElnLayout pageTitle={title}>{page}</ElnLayout>;
};
