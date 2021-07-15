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
import React, { useContext, useEffect, useState } from 'react';

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
} from '../../components/tailwind-ui';

import {
  FilesByConfigQuery,
  FileStatus,
  useFilesByConfigLazyQuery,
} from './generated/graphql';

interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
  id: string;
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
  setState(): void {},
  id: '',
});
export default function TableFilesSync({ data, id }: TableFilesSyncProps) {
  const [state, setState] = useState<TreeSync[]>([]);

  useEffect(() => {
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
  }, [data]);

  return (
    <TreeContext.Provider value={{ state, setState, id }}>
      <Table
        tableClassName="table-fixed"
        Header={Header}
        Empty={Empty}
        Tr={Row}
        data={state}
      />
    </TreeContext.Provider>
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

function DirRow({ value }: { value: DirSync }) {
  const [expanded, setExpanded] = useState(false);
  const context = useContext(TreeContext);
  const [fetchChild, { loading, called, data }] = useFilesByConfigLazyQuery({
    variables: { id: context.id, path: [...value.path, value.id] },
  });
  const size = bytes(value.size).toString();

  useEffect(() => {
    if (called && !loading && data) {
      const { files, dirs } = data.filesByConfig;
      context.setState(
        produce(context.state, (draft: TreeSync[]) => {
          let edges: TreeSync[] = draft;
          for (const step of value.path) {
            edges =
              (
                edges.find(
                  ({ id, type }) => id === step && type === TreeType.dir,
                ) as DirSync | undefined
              )?.children ?? [];
          }
          let node: DirSync | undefined = edges.find(
            ({ id, type }) => id === value.id && type === TreeType.dir,
          ) as DirSync | undefined;

          if (node) {
            node.children = [
              ...dirs.map((dir) => ({
                id: dir.relativePath,
                name: dir.relativePath,
                size: dir.size,
                path: dir.path,
                date: new Date(dir.date),
                type: TreeType.dir as const,
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
          }
        }),
      );
    }
  }, [called, loading, data, context, value.path, value.id]);

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
              setExpanded(!expanded);
              if (!called && !value.children) fetchChild();
            }}
          >
            {expanded ? (
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
      {expanded && loading && <Spinner className="w-10 h-10 text-danger-500" />}
      {expanded && value.children
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
