import React from 'react';
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
} from '../../generated/graphql';

import TableFilesFiltered from './TableFilesFiltered';
import TableFilesSync from './TableFilesSync';

interface RouterQuery {
  id: string;
  page?: string;
  minSize?: string;
  maxSize?: string;
  minDate?: string;
  maxDate?: string;
  status?: FileStatus[];
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
  minSize,
  maxSize,
  ...filters
}: Required<RouterQuery>) {
  const pageNum = parseInt(page, 10);
  const { data, loading, error } = useFilesByConfigFlatQuery({
    variables: {
      id,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        minSize: parseInt(minSize, 10),
        maxSize: parseInt(maxSize, 10),
        ...filters,
      },
      sortBy: { field: sortField, direction: sortDirection },
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

ListFiles.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of filtered files">{page}</ElnLayout>
);
