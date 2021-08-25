import { InboxIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Table, Td, Th, Variant } from '@components/tailwind-ui';

import DirRow from './DirRow';
import FileRow from './FileRow';
import { TreeContext } from './TreeContext';
import { TableFilesSyncProps, TreeType, TreeSync } from './types';

export default function TableFilesSync({ data, id }: TableFilesSyncProps) {
  const [state, setState] = useState<TreeSync[]>(() => {
    const filesQuery = data?.filesByConfig.files ?? [];
    const dirsQuery = data?.filesByConfig.dirs ?? [];
    let tree: TreeSync[] = [];

    for (const dir of dirsQuery) {
      tree.push({
        id: dir.id,
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
        type: TreeType.file,
        expanded: false,
      });
    }
    return tree;
  });

  return (
    <div>
      <Link to={`${id}?page=1`}>
        <Button className="mb-2" variant={Variant.secondary}>
          Filters
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
export function Row({ value }: { value: TreeSync }) {
  return value.type === TreeType.file ? (
    <FileRow value={value} />
  ) : (
    <DirRow value={value} />
  );
}
