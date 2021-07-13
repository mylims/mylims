import {
  InboxIcon,
  DownloadIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline';
import bytes from 'byte-size';
import { format, max } from 'date-fns';
import React, { useMemo, useState } from 'react';

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

import { FilesByConfigQuery, FileStatus } from './generated/graphql';

interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
}

enum TreeType {
  file = 'file',
  dir = 'dir',
}
interface SyncBase {
  id: string;
  name: string;
  size: number;
  level: number;
  date: Date;
}
interface FileSync extends SyncBase {
  type: TreeType.file;
  relativePath: string;
  revisionId: string;
  countRevisions: number;
  status: FileStatus;
  downloadUrl: string;
}
interface DirSync extends SyncBase {
  type: TreeType.dir;
  children: TreeSync[];
}
type TreeSync = FileSync | DirSync;

export default function TableFilesSync({ data }: TableFilesSyncProps) {
  const files = useMemo(() => {
    let ans: TreeSync[] = [];
    for (const file of data?.filesByConfig ?? []) {
      const path = file.relativePath.split('\\');
      const name = path[path.length - 1];
      const leaf: FileSync = {
        ...file,
        date: new Date(file.date),
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
              date: leaf.date,
              children: [],
              level: i,
            });
            filesList = (filesList[filesList.length - 1] as DirSync).children;
          } else {
            const latestDate = max([leaf.date, filesList[index].date]);
            filesList[index].date = latestDate;
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
        style={{ paddingLeft: `${1.5 + 1.5 * value.level}rem` }}
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
  const size = bytes(value.size).toString();
  return (
    <>
      <tr>
        <Td
          title={value.name}
          className="flex items-center truncate"
          style={{ paddingLeft: `${1.5 + 1.5 * value.level}rem` }}
        >
          <Button
            color={Color.neutral}
            roundness={Roundness.circular}
            variant={Variant.secondary}
            className="mr-2"
            title="Expand"
            onClick={() => setExpanded(!expanded)}
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
