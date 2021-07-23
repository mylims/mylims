import React, { useContext, useEffect, useState } from 'react';
import {
  InboxIcon,
  DownloadIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';
import bytes from 'byte-size';
import { format } from 'date-fns';
import { produce } from 'immer';
import { Link } from 'react-router-dom';
import ElnLayout from '@components/ElnLayout';

import {
  Badge,
  BadgeVariant,
  Button,
  Color,
  Roundness,
  Spinner,
  Table,
  Td,
  Th,
  Variant,
} from '@components/tailwind-ui';

import {
  FilesByConfigQuery,
  FileStatus,
  useFilesByConfigLazyQuery,
} from './generated/graphql';

interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
  id: string;
  loading: boolean;
}

enum TreeType {
  file = 'file',
  dir = 'dir',
}
interface SyncBase {
  id: string;
  name: string;
  size: number;
  date: Date;
  path: string[];
}
interface FileSync extends SyncBase {
  type: TreeType.file;
  relativePath: string;
  countRevisions: number;
  status: FileStatus;
  downloadUrl: string;
}
interface DirSync extends SyncBase {
  type: TreeType.dir;
  expanded: boolean;
  children: TreeSync[] | null;
}
type TreeSync = FileSync | DirSync;

interface TreeContextType {
  state: TreeSync[];
  setState: (state: TreeSync[]) => void;
  id: string;
}
const TreeContext = React.createContext<TreeContextType>({
  state: [],
  setState(): void {
    // do nothing
  },
  id: '',
});
export default function TableFilesSync({
  data,
  id,
  loading,
}: TableFilesSyncProps) {
  const [state, setState] = useState<TreeSync[]>([]);

  useEffect(() => {
    if (state.length === 0) {
      const filesQuery = data?.filesByConfig.files ?? [];
      const dirsQuery = data?.filesByConfig.dirs ?? [];
      let tree: TreeSync[] = [];

      for (const dir of dirsQuery) {
        tree.push({
          id: dir.relativePath,
          name: dir.relativePath,
          size: dir.size,
          path: dir.path,
          date: new Date(dir.date),
          type: TreeType.dir,
          expanded: false,
          children: null,
        });
      }

      for (const file of filesQuery) {
        tree.push({
          ...file,
          date: new Date(file.date),
          name: file.filename,
          id: file.relativePath,
          type: TreeType.file,
        });
      }
      setState(tree);
    }
  }, [data, state]);

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  return (
    <div>
      <Link to={`${id}?page=1`}>
        <Button className="ml-2" title="Configuration">
          First page
        </Button>
      </Link>

      <TreeContext.Provider value={{ state, setState, id }}>
        <Table
          tableClassName="table-fixed"
          Header={Header}
          Empty={Empty}
          Tr={Row}
          data={state}
        />
      </TreeContext.Provider>
    </div>
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-1/2">Relative path</Th>
      <Th className="w-1/12">Size</Th>
      <Th className="w-1/12">Update date</Th>
      <Th className="w-1/12">Revisions</Th>
      <Th className="w-1/12">Status</Th>
      <Th className="w-1/12">Actions</Th>
    </tr>
  );
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
function Row({ value }: { value: TreeSync }) {
  return value.type === TreeType.file ? (
    <FileRow value={value} />
  ) : (
    <DirRow value={value} />
  );
}

function FileRow({ value }: { value: FileSync }) {
  const size = bytes(value.size).toString();

  return (
    <tr>
      <Td
        title={value.relativePath}
        className="flex items-center truncate"
        style={{ paddingLeft: `${1.5 + 1.5 * value.path.length}rem` }}
      >
        <DocumentTextIcon className="w-5 h-5 mr-1" />
        {value.name}
      </Td>
      <Td>{size}</Td>
      <Td>{format(value.date, 'dd.MM.yyyy')}</Td>
      <Td>{value.countRevisions}</Td>
      <Td>
        <FileStatusLabel status={value.status} />
      </Td>
      <Td>
        <a href={value.downloadUrl} target="_blank" rel="noreferrer">
          <Button
            color={Color.neutral}
            roundness={Roundness.circular}
            variant={Variant.secondary}
            className="ml-2"
            title="Download"
          >
            <DownloadIcon className="w-3 h-3" />
          </Button>
        </a>
      </Td>
    </tr>
  );
}

function changeNodeValue(
  tree: TreeSync[],
  path: string[],
  name: string,
  callback: (node: DirSync) => DirSync,
) {
  return produce(tree, (draft) => {
    let edges: TreeSync[] = draft;
    for (const step of path) {
      edges =
        (
          edges.find(({ id, type }) => id === step && type === TreeType.dir) as
            | DirSync
            | undefined
        )?.children ?? [];
    }
    let node: DirSync | undefined = edges.find(
      ({ id, type }) => id === name && type === TreeType.dir,
    ) as DirSync | undefined;

    if (node) {
      node = callback(node);
    }
  });
}

function DirRow({ value }: { value: DirSync }) {
  const context = useContext(TreeContext);
  const [fetchChild, { loading, called, data }] = useFilesByConfigLazyQuery({
    variables: { id: context.id, path: [...value.path, value.id] },
  });
  const size = bytes(value.size).toString();

  useEffect(() => {
    if (called && !loading && data && !value.children) {
      const { files, dirs } = data.filesByConfig;
      context.setState(
        changeNodeValue(context.state, value.path, value.id, (node) => {
          node.children = [
            ...dirs.map((dir) => ({
              id: dir.relativePath,
              name: dir.relativePath,
              size: dir.size,
              path: dir.path,
              date: new Date(dir.date),
              type: TreeType.dir as const,
              expanded: false,
              children: null,
            })),
            ...files.map((file) => ({
              ...file,
              date: new Date(file.date),
              name: file.filename,
              id: file.relativePath,
              type: TreeType.file as const,
            })),
          ];
          return node;
        }),
      );
    }
  }, [called, loading, data, context, value.path, value.id, value.children]);

  return (
    <>
      <tr>
        <Td
          title={value.name}
          className="flex items-center truncate"
          style={{ paddingLeft: `${1.5 + 1.5 * value.path.length}rem` }}
        >
          <Button
            color={Color.neutral}
            roundness={Roundness.circular}
            variant={Variant.secondary}
            className="mr-2"
            title="Expand"
            onClick={() => {
              context.setState(
                changeNodeValue(context.state, value.path, value.id, (node) => {
                  node.expanded = !node.expanded;
                  return node;
                }),
              );
              if (!called && !value.children) fetchChild();
            }}
          >
            {value.expanded ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </Button>
          <FolderOpenIcon className="w-5 h-5 mr-1" />
          {value.name}
        </Td>
        <Td>{size}</Td>
        <Td>{format(new Date(value.date), 'dd.MM.yyyy')}</Td>
        <Td />
        <Td />
        <Td />
      </tr>
      {value.expanded && value.children
        ? value.children.map((child) => <Row key={child.id} value={child} />)
        : null}
    </>
  );
}

function FileStatusLabel({ status }: { status: FileStatus }) {
  let color: Color;
  switch (status) {
    case 'imported': {
      color = Color.primary;
      break;
    }
    case 'import_fail': {
      color = Color.danger;
      break;
    }
    default: {
      color = Color.warning;
      break;
    }
  }
  return (
    <Badge
      variant={BadgeVariant.COLORED_BACKGROUND}
      label={status}
      color={color}
    />
  );
}

TableFilesSync.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of synchronized files">{page}</ElnLayout>
);
