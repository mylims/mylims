import { InboxIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';
import {
  Badge,
  BadgeVariant,
  Color,
  Table,
  Td,
  Th,
} from '../../components/tailwind-ui';

import { FilesByConfigQuery, FileStatus } from './generated/graphql';

interface TableFilesSyncProps {
  data?: FilesByConfigQuery;
}

interface FileSync {
  id: string;
  revisionId: string;
  countRevisions: number;
  size: number;
  relativePath: string;
  status: FileStatus;
}

export default function TableFilesSync({ data }: TableFilesSyncProps) {
  const files = useMemo(
    () =>
      (data?.filesByConfig ?? []).map((item) => ({
        ...item,
        id: item.revisionId,
      })),
    [data],
  );
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
      <Th className="w-3/6">Relative path</Th>
      <Th className="w-1/6">Size</Th>
      <Th className="w-1/6">Status</Th>
      <Th className="w-1/6">Revisions</Th>
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
function Row({ value }: { value: FileSync }) {
  return (
    <tr>
      <Td title={value.relativePath} className="truncate">
        {value.relativePath}
      </Td>
      <Td>{value.size}</Td>
      <Td>
        <FileStatusLabel status={value.status} />
      </Td>
      <Td>{value.countRevisions}</Td>
    </tr>
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
