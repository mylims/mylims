import { FolderOpenIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect } from 'react';

import { Td } from '@/components/tailwind-ui';
import { useFilesByConfigLazyQuery } from '@/generated/graphql';
import { formatBytes, formatDate } from '@/utils/formatFields';

import { ExpandCell } from './ExpandCell';
import { TreeContext, changeNodeValue } from './TreeContext';
import { DirSync, TreeType } from './types';

import { Row } from './index';

export default function DirRow({ value }: { value: DirSync }) {
  const context = useContext(TreeContext);
  const [fetchChild, { loading, called, data }] = useFilesByConfigLazyQuery({
    variables: { id: context.id, path: [...value.path, value.id] },
  });

  useEffect(() => {
    if (called && !loading && data && !value.children) {
      const { files, dirs, ignoredFiles } = data.filesByConfig;
      context.setState(
        changeNodeValue(context.state, value.path, value.id, (node) => {
          if (node.type === TreeType.dir) {
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
                type: TreeType.file as const,
                expanded: false,
              })),
            ];
            if (ignoredFiles > 0) {
              node.children.unshift({
                id: 'ignored',
                ignoredFiles,
                type: TreeType.limit as const,
              });
            }
          }
          return node;
        }),
      );
    }
  }, [called, loading, data, context, value.path, value.id, value.children]);

  return (
    <>
      <tr>
        <ExpandCell
          title={value.name}
          value={value}
          called={called}
          fetchChild={fetchChild}
          icon={<FolderOpenIcon className="mr-1 h-5 w-5" />}
        />
        <Td>{formatBytes(value.size)}</Td>
        <Td>{formatDate(value.date)}</Td>
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
