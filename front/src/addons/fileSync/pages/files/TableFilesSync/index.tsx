import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import DirRow from './DirRow';
import FileRow from './FileRow';
import { TreeContext } from './TreeContext';
import { TableFilesSyncProps, TreeType, TreeSync } from './types';

import TableEmpty from '@/components/TableEmpty';
import TableHeader from '@/components/TableHeader';
import { Button, Table, Variant } from '@/components/tailwind-ui';

const titles = [
  { className: 'w-1/12', name: 'Relative path' },
  { className: 'w-1/12', name: 'Size' },
  { className: 'w-1/12', name: 'Update date' },
  { className: 'w-1/12', name: 'Revisions' },
  { className: 'w-1/12', name: 'Status' },
  { className: 'w-1/12', name: 'Actions' },
];
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
          Header={() => <TableHeader titles={titles} />}
          Empty={() => <TableEmpty titles={titles} />}
          Tr={Row}
          data={state}
        />
      </TreeContext.Provider>
    </div>
  );
}

export function Row({ value }: { value: TreeSync }) {
  return value.type === TreeType.file ? (
    <FileRow value={value} />
  ) : (
    <DirRow value={value} />
  );
}
