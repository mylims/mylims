import { DownloadIcon } from '@heroicons/react/outline';
import React from 'react';

import { FileStatusLabel } from '@/components/FileStatusLabel';
import { DownloadButton, LinkButton } from '@/components/LinkButton';
import { TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { Unflatten } from '@/components/TableQuery/types';
import {
  getVariablesFromQuery,
  PAGE_SIZE,
} from '@/components/TableQuery/utils';
import { Color } from '@/components/tailwind-ui';
import {
  FilesSortField,
  SortDirection,
  FilesFilterInput,
  FilesSortInput,
  useFilesByConfigFlatQuery,
  SyncFileRevision,
  FileStatus,
} from '@/generated/graphql';
import { formatBytes } from '@/utils/formatFields';

type FilterType = Unflatten<FilesFilterInput, FilesSortInput>;

export function FilterTable({ id }: { id: string }) {
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.field': FilesSortField.DATE,
    'sortBy.direction': SortDirection.DESC,
  });
  const variables = getVariablesFromQuery<FilterType>(query);
  const { loading, error, data } = useFilesByConfigFlatQuery({
    variables: { ...variables, id },
  });

  return (
    <div>
      <LinkButton to="." className="mb-4">
        Directory view
      </LinkButton>
      <TableQuery
        data={data?.filesByConfigFlat}
        loading={loading}
        error={error}
        itemsPerPage={PAGE_SIZE}
        query={query}
        onQueryChange={(query) => setQuery(query)}
      >
        <TableQuery.Queries />
        <TableQuery.TextColumn
          title="Relative path"
          dataPath="relativePath"
          disableSort
        />
        <TableQuery.NumberColumn title="Size" dataPath="size">
          {(row) => {
            const { size } = row as SyncFileRevision;
            return formatBytes(size);
          }}
        </TableQuery.NumberColumn>
        <TableQuery.DateColumn title="Creation date" dataPath="date" />
        <TableQuery.MultiSelectColumn
          title="Status"
          dataPath="status"
          options={[
            FileStatus.PENDING,
            FileStatus.IMPORTING,
            FileStatus.IMPORTED,
            FileStatus.IMPORT_FAIL,
          ]}
          disableSort
        >
          {(row) => {
            const { status } = row as SyncFileRevision;
            return <FileStatusLabel status={status} />;
          }}
        </TableQuery.MultiSelectColumn>
        <TableQuery.ActionsColumn>
          {(row) => {
            const { downloadUrl } = row as SyncFileRevision;
            return (
              <DownloadButton
                to={downloadUrl}
                color={Color.neutral}
                title="Download"
              >
                <DownloadIcon className="h-4 w-4" />
              </DownloadButton>
            );
          }}
        </TableQuery.ActionsColumn>
      </TableQuery>
    </div>
  );
}
