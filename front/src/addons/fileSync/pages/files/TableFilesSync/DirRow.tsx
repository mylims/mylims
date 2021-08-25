import { FolderOpenIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect } from 'react';

import ExpandButton from '@components/ExpandButton';
import { Td } from '@components/tailwind-ui';
import { formatBytes, formatDate } from '@utils/formatFields';

import { useFilesByConfigLazyQuery } from '../../../generated/graphql';

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
      const { files, dirs } = data.filesByConfig;
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
                id: file.relativePath,
                type: TreeType.file as const,
                expanded: false,
              })),
            ];
          }
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
          <ExpandButton
            onExpand={() => {
              context.setState(
                changeNodeValue(context.state, value.path, value.id, (node) => {
                  node.expanded = !node.expanded;
                  return node;
                }),
              );
              if (!called && !value.children) fetchChild();
            }}
            expanded={value.expanded}
          />

          <FolderOpenIcon className="w-5 h-5 mr-1" />
          {value.name}
        </Td>
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
