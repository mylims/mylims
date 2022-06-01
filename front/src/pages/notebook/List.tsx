import { EyeIcon, InformationCircleIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { LinkButton } from '@/components/LinkButton';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { getVariablesFromQuery } from '@/components/TableQuery/utils';
import {
  Button,
  Card,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import {
  NotebookSortField,
  SortDirection,
  useNotebookListQuery,
} from '@/generated/graphql';
import {
  LabelsBadge,
  SampleCodeBadge,
} from '@/pages/notebook/components/Badges';
import { NotebookListItem } from '@/pages/notebook/models';

export default function NotebookList() {
  const [state, setState] = useState<NotebookListItem | null>(null);
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.field': NotebookSortField.CREATEDAT,
    'sortBy.direction': SortDirection.DESC,
  });
  const variables = getVariablesFromQuery(query);
  const { loading, error, data } = useNotebookListQuery({ variables });

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <TableQuery
          data={data?.notebooks}
          loading={loading}
          error={error}
          query={query}
          onQueryChange={(query) => setQuery(query)}
        >
          <TableQuery.Queries />
          <TableQuery.ActionsColumn>
            {(row) => (
              <Button
                title="preview"
                className="ml-2"
                color={Color.success}
                roundness={Roundness.circular}
                size={Size.small}
                variant={
                  row.id === state?.id ? Variant.primary : Variant.secondary
                }
                onClick={() => setState(row as NotebookListItem)}
              >
                <EyeIcon className="h-5 w-5" />
              </Button>
            )}
          </TableQuery.ActionsColumn>
          <TableQuery.TextColumn title="Title" dataPath="title" />
          <TableQuery.TextColumn title="Description" dataPath="description" />
          <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
          <TableQuery.UserColumn title="User" dataPath="user" />
          <TableQuery.TextColumn title="Labels" dataPath="labels" disableSort>
            {(row) => <LabelsBadge notebook={row as NotebookListItem} />}
          </TableQuery.TextColumn>
          <TableQuery.TextColumn title="Project" dataPath="project" />
          <TableQuery.TextColumn
            title="Samples"
            dataPath="samples"
            disableSearch
          >
            {(row) => <SampleCodeBadge notebook={row as NotebookListItem} />}
          </TableQuery.TextColumn>
          <TableQuery.TextColumn
            title="Measurements"
            dataPath="measurements"
            disableSearch
          >
            {(row) => (row as NotebookListItem).measurements.length}
          </TableQuery.TextColumn>
        </TableQuery>
      </div>
      <div>
        <LinkButton
          to="/notebook/create"
          className="mb-4"
          color={Color.success}
        >
          + New notebook
        </LinkButton>
        <Card>
          <Card.Header className="flex flex-row justify-between bg-neutral-50 text-neutral-500">
            <span>Preview</span>

            {state ? (
              <LinkButton
                title="detail"
                to={`/notebook/detail/${state.id}`}
                className="flex space-x-2"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span>Detail</span>
              </LinkButton>
            ) : null}
          </Card.Header>
          <Card.Body>
            {!state ? (
              <p className="text-center text-neutral-500">
                Select a notebook to preview
              </p>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4 ">
                  <FieldDescription title="Title">
                    {state.title ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="Project">
                    {state.project ?? '-'}
                  </FieldDescription>
                </div>
                <FieldDescription title="Description">
                  {state.description ?? '-'}
                </FieldDescription>
                <FieldDescription title="Samples">
                  <SampleCodeBadge notebook={state} />
                </FieldDescription>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

NotebookList.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
