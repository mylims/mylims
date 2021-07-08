import {
  InboxIcon,
  DownloadIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';
import React, { useMemo, useState } from 'react';
import bytes from 'byte-size';

import {
  Badge,
  BadgeVariant,
  Button,
  Color,
  Roundness,
  Table,
  Td,
  Th,
  Variant,
} from '../../components/tailwind-ui';

import {
  FilesByConfigQuery,
  FileStatus,
  SyncFileRevision,
} from './generated/graphql';

interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
}

enum TreeType {
  file = 'file',
  dir = 'dir',
}
interface FileSync {
  id: string;
  type: TreeType.file;
  name: string;
  size: number;
  level: number;
  revisionId: string;
  countRevisions: number;
  status: FileStatus;
}
interface DirSync {
  id: string;
  type: TreeType.dir;
  name: string;
  size: number;
  level: number;
  children: TreeSync[];
}
type TreeSync = FileSync | DirSync;

export default function TableFilesSync({ data }: TableFilesSyncProps) {
  const files = useMemo(() => {
    let ans: TreeSync[] = [];
    for (const file of data?.filesByConfig ?? []) {
      const { relativePath, ...fileOther } = file;
      const path = relativePath.split('\\');
      const name = path[path.length - 1];
      const leaf: FileSync = {
        ...fileOther,
        name,
        id: file.relativePath,
        type: TreeType.file,
        level: path.length - 1,
      };

      if (path.length === 1) {
        // Root file
        ans.push(leaf);
      } else {
        // Nested file
        let filesList = ans;
        for (let i = 0; i < path.length - 1; i++) {
          const currDir = path[i];
          let index = filesList.findIndex(
            ({ name, type }) => type === TreeType.dir && name === currDir,
          );
          if (index === -1) {
            filesList.push({
              id: currDir,
              name: currDir,
              type: TreeType.dir,
              size: leaf.size,
              children: [],
              level: i,
            });
            filesList = (filesList[filesList.length - 1] as DirSync).children;
          } else {
            filesList[index].size += leaf.size;
            filesList = (filesList[index] as DirSync).children;
          }
        }
        filesList.push(leaf);
      }
    }
    return ans.sort((a, b) => {
      if (a.type === TreeType.dir && b.type === TreeType.file) return -1;
      if (b.type === TreeType.dir && a.type === TreeType.file) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  return (
    <Table
      tableClassName="table-fixed"
      Header={Header}
      Empty={Empty}
      Tr={Row}
      data={files}
    />
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-1/2">Relative path</Th>
      <Th className="w-1/12">Size</Th>
      <Th className="w-1/12">Revisions</Th>
      <Th className="w-2/12">Status</Th>
      <Th className="w-2/12">Actions</Th>
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
        title={value.name}
        className="flex truncate"
        style={{ paddingLeft: `${1.5 + 1.5 * value.level}rem` }}
      >
        <DocumentTextIcon className="w-5 h-5 mr-1" />
        {value.name}
      </Td>
      <Td>{size}</Td>
      <Td>{value.countRevisions}</Td>
      <Td>
        <FileStatusLabel status={value.status} />
      </Td>
      <Td>
        <Button
          color={Color.neutral}
          roundness={Roundness.circular}
          variant={Variant.secondary}
          className="ml-2"
          title="Download"
        >
          <DownloadIcon className="w-3 h-3" />
        </Button>
      </Td>
    </tr>
  );
}

function DirRow({ value }: { value: DirSync }) {
  const [expanded, setExpanded] = useState(false);
  const size = bytes(value.size).toString();
  return (
    <>
      <tr>
        <Td
          title={value.name}
          className="flex truncate"
          style={{ paddingLeft: `${1.5 + 1.5 * value.level}rem` }}
        >
          <FolderOpenIcon className="w-5 h-5 mr-1" />
          {value.name}
        </Td>
        <Td>{size}</Td>
        <Td> - </Td>
        <Td> - </Td>
        <Td>
          <Button
            color={Color.neutral}
            roundness={Roundness.circular}
            variant={Variant.secondary}
            className="ml-2"
            title="Expand"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </Button>
        </Td>
      </tr>
      {expanded
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
