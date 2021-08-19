import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ElnLayout from '@components/ElnLayout';
import { Alert, AlertType } from '@components/tailwind-ui';
import { useFilterQuery } from 'src/hooks/useQuery';

import {
  useFilesByConfigQuery,
  useFilesByConfigFlatQuery,
  FilesSortField,
  SortDirection,
  FileStatus,
  FileSyncOptionDocument,
} from '../../generated/graphql';

import TableFilesFiltered from './TableFilesFiltered';
import TableFilesSync from './TableFilesSync';

interface RouterQuery {
  id: string;
  page?: string;
  minSize?: number;
  maxSize?: number;
  minDate?: Date;
  maxDate?: Date;
  status?: Record<'value' | 'label', FileStatus>[];
  sortField?: FilesSortField;
  sortDirection?: SortDirection;
}

const PAGE_SIZE = 10;

export default function ListFiles() {
  const router = useHistory();
  const { id } = useParams<{ id: string }>();
  const [{ page, ...filters }] = useFilterQuery('');

  if (id === undefined) {
    void router.push('list');
    return null;
  }

  if (page) {
    return <FilterTable id={id} page={page} {...filters} />;
  } else {
    return <NestedTable id={id} />;
  }
}

function NestedTable({ id }: Pick<RouterQuery, 'id'>) {
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

  return <TableFilesSync loading={loading} data={data} id={id} />;
}

function FilterTable({
  id,
  page,
  sortField,
  sortDirection,
  status,
  ...filters
}: RouterQuery) {
  const pageNum = page !== undefined ? parseInt(page, 10) : 1;
  const { data, loading, error } = useFilesByConfigFlatQuery({
    variables: {
      id,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        ...filters,
        status: status?.map(({ value }) => value),
      },
      sortBy: {
        field: sortField || FilesSortField.DATE,
        direction: sortDirection || SortDirection.DESC,
      },
    },
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

  return (
    <TableFilesFiltered
      id={id}
      loading={loading}
      data={data}
      page={pageNum}
      pageSize={PAGE_SIZE}
    />
  );
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
          if (data) {
            setTitle(data.fileSyncOption.root);
          }
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    }
  }, [id, query]);

  return <ElnLayout pageTitle={title}>{page}</ElnLayout>;
};
