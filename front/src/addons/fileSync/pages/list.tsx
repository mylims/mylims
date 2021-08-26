import {
  CheckIcon,
  CogIcon,
  TableIcon,
  TrashIcon,
  XIcon,
  InboxIcon,
} from '@heroicons/react/outline';
import React from 'react';
import { Link } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import {
  Alert,
  AlertType,
  Badge,
  BadgeVariant,
  Button,
  Color,
  Roundness,
  Spinner,
  Table,
  Td,
  Th,
} from '@/components/tailwind-ui';

import {
  FileSyncOptionsQuery,
  useFileSyncOptionsQuery,
  useDeleteFileSyncOptionMutation,
  refetchFileSyncOptionsQuery,
} from '../generated/graphql';

export default function ConfigList() {
  const { loading, error: queryError, data } = useFileSyncOptionsQuery();

  const [deleteFileSyncOptionMutation, { error: mutationError }] =
    useDeleteFileSyncOptionMutation({
      refetchQueries: [refetchFileSyncOptionsQuery()],
    });

  const error = queryError || mutationError || null;

  return (
    <>
      {error && (
        <Alert title={'Error'} type={AlertType.ERROR}>
          Unexpected error: {error.message}
        </Alert>
      )}

      <Link to="create">
        <Button className="mb-4">Create</Button>
      </Link>
      {loading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <Table
          tableClassName="table-fixed"
          Header={Header}
          Empty={Empty}
          Tr={Row(deleteFileSyncOptionMutation)}
          data={data?.fileSyncOptions ?? []}
        />
      )}
    </>
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-1/12">Enabled</Th>
      <Th className="w-4/12">Root</Th>
      <Th className="w-3/12">Topics</Th>
      <Th className="w-1/12">Patterns</Th>
      <Th className="w-1/12">Ready checks</Th>
      <Th className="w-2/12">Actions</Th>
    </tr>
  );
}

function Row(
  deleteFileSyncOption: ReturnType<typeof useDeleteFileSyncOptionMutation>[0],
) {
  return ({
    value,
  }: {
    value: FileSyncOptionsQuery['fileSyncOptions'][number];
  }) => {
    return (
      <tr>
        <Td>
          {value.enabled ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <XIcon className="w-5 h-5" />
          )}
        </Td>
        <Td title={value.root} className="truncate">
          {value.root}
        </Td>
        <Td>
          {value.topics.map((topic) => (
            <Badge
              key={topic}
              variant={BadgeVariant.COLORED_BACKGROUND}
              label={topic}
              color={Color.primary}
            />
          ))}
        </Td>
        <Td>{value.patterns.length}</Td>
        <Td>{value.readyChecks.length}</Td>
        <Td>
          <Link to={`files/${value.id}`}>
            <Button
              roundness={Roundness.circular}
              color={Color.success}
              title="List of files"
            >
              <TableIcon className="w-5 h-5" />
            </Button>
          </Link>
          <Link to={`edit/${value.id}`}>
            <Button
              roundness={Roundness.circular}
              className="ml-2"
              title="Configuration"
            >
              <CogIcon className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            color={Color.danger}
            roundness={Roundness.circular}
            className="ml-2"
            onClick={() =>
              deleteFileSyncOption({ variables: { input: { id: value.id } } })
            }
            title="Delete configuration"
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        </Td>
      </tr>
    );
  };
}

function Empty() {
  return (
    <>
      <Header />
      <tr>
        <Td colSpan={4} align="center">
          <div className="flex flex-row justify-center text-neutral-500">
            <InboxIcon className="w-5 h-5 mr-2" />
            <span>Empty</span>
          </div>
        </Td>
      </tr>
    </>
  );
}

ConfigList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
