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
  FileSyncOptionQuery,
  FileSyncOptionsQuery,
  useFileSyncOptionsQuery,
} from '../../../generated/graphql';

export default function ConfigList() {
  const { loading, error, data } = useFileSyncOptionsQuery();

  return (
    <>
      {error && (
        <Alert title={'Error while fetching user'} type={AlertType.ERROR}>
          Unexpected error {error}
        </Alert>
      )}
      {loading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <Table
          tableClassName="table-fixed"
          Header={Header}
          Empty={Empty}
          Tr={Row}
          data={data?.fileSyncOptions ?? []}
        />
      )}
      <Link href="create">
        <Button roundness={Roundness.circular}>
          <SvgOutlinePlus />
        </Button>
      </Link>
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

function Row(props: {
  value: FileSyncOptionsQuery['fileSyncOptions'][number];
}) {
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
        <Link href="">
          <Button
            color={Color.danger}
            roundness={Roundness.circular}
            className="ml-2"
          >
            <SvgOutlineTrash />
          </Button>
        </Link>
      </Td>
    </tr>
  );
}

function Empty() {
  return <h1>Empty</h1>;
}

ConfigList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
