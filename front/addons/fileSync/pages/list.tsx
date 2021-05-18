import Link from 'next/link';

import ElnLayout from '../../../components/ElnLayout';
import {
  Alert,
  AlertType,
  Button,
  Color,
  Roundness,
  Spinner,
  SvgOutlineCheck,
  SvgOutlineCog,
  SvgOutlinePlus,
  SvgOutlineTrash,
  SvgOutlineX,
  Table,
  Td,
  Th,
} from '../../../components/tailwind-ui';
import {
  FileSyncOptionsQuery,
  useFileSyncOptionsQuery,
  useDeleteFileSyncOptionMutation,
  refetchFileSyncOptionsQuery,
} from '../../../generated/graphql';

export default function ConfigList() {
  const { loading, error: queryError, data } = useFileSyncOptionsQuery();

  const [
    deleteFileSyncOptionMutation,
    { error: mutationError },
  ] = useDeleteFileSyncOptionMutation({
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

      <Link href="create">
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
      <Th className="w-1/3">Enabled</Th>
      <Th className="w-1/3">Root</Th>
      <Th className="w-1/3">Patterns</Th>
      <Th>Actions</Th>
    </tr>
  );
}

function Row(
  deleteFileSyncOption: ReturnType<typeof useDeleteFileSyncOptionMutation>[0],
) {
  return (props: {
    value: FileSyncOptionsQuery['fileSyncOptions'][number];
  }) => {
    const { value } = props;

    return (
      <tr>
        <Td>{value.enabled ? <SvgOutlineCheck /> : <SvgOutlineX />}</Td>
        <Td>{value.root}</Td>
        <Td>{value.patterns.length}</Td>
        <Td>
          <Link href="edit/[id]" as={`edit/${value.id}`}>
            <Button roundness={Roundness.circular}>
              <SvgOutlineCog />
            </Button>
          </Link>
          <Button
            color={Color.danger}
            roundness={Roundness.circular}
            className="ml-2"
            onClick={() =>
              deleteFileSyncOption({ variables: { input: { id: value.id } } })
            }
          >
            <SvgOutlineTrash />
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
          Empty
        </Td>
      </tr>
    </>
  );
}

ConfigList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
