import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TableFilesFiltered from './TableFilesFiltered';
import TableFilesSync from './TableFilesSync';

import ElnLayout from '@/components/ElnLayout';
import { Alert, AlertType, Spinner } from '@/components/tailwind-ui';
import {
  useFilesByConfigQuery,
  useFilesByConfigFlatQuery,
  FilesSortField,
  SortDirection,
  FileStatus,
  FileSyncOptionDocument,
} from '@/generated/graphql';
import { useFilterFilesQuery } from '@/hooks/useFileQuery';
import filesizeParser from '@/utils/filesize-parser';

interface RouterQuery {
  id: string;
  page: string;
  minSize: string | null;
  maxSize: string | null;
  minDate: Date | null;
  maxDate: Date | null;
  status: Record<'value' | 'label', FileStatus>[] | null;
  sortField: { value: FilesSortField; label: string } | null;
  sortDirection: { value: SortDirection; label: string } | null;
}

const PAGE_SIZE = 10;

export default function ListFiles() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [{ page, ...filters }] = useFilterFilesQuery();

  if (id === undefined) {
    void navigate('../../list');
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

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  return <TableFilesSync data={data} id={id} />;
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
  const minSize = filters.minSize ? filesizeParser(filters.minSize) : undefined;
  const maxSize = filters.maxSize ? filesizeParser(filters.maxSize) : undefined;
  const { data, loading, error } = useFilesByConfigFlatQuery({
    variables: {
      id,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        ...filters,
        size: { min: minSize, max: maxSize },
        status: status?.map(({ value }) => value),
      },
      sortBy: {
        field: sortField?.value || FilesSortField.DATE,
        direction: sortDirection?.value || SortDirection.DESC,
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
          if (data) setTitle(data.fileSyncOption.root);
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    }
  }, [id, query]);

  return <ElnLayout pageTitle={title}>{page}</ElnLayout>;
};
