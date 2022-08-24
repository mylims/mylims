import React, { ReactNode, useContext } from 'react';

import ExpandButton from '@/components/ExpandButton';
import { Td } from '@/components/tailwind-ui';

import { TreeContext, changeNodeValue } from './TreeContext';
import { DirSync, FileSync, TreeType } from './types';


interface ExpandCellProps {
  value: FileSync | DirSync;
  title: string;
  icon: ReactNode;
  called: boolean;
  fetchChild: () => Promise<unknown>;
}
export function ExpandCell({
  value,
  title,
  icon,
  called,
  fetchChild,
}: ExpandCellProps) {
  const context = useContext(TreeContext);
  return (
    <Td
      title={title}
      className="flex items-center truncate"
      style={{ paddingLeft: `${1.5 + 1.5 * value.path.length}rem` }}
    >
      <ExpandButton
        onExpand={() => {
          context.setState(
            changeNodeValue(context.state, value.path, value.id, (node) => {
              if (node.type !== TreeType.limit) node.expanded = !node.expanded;
              return node;
            }),
          );
          // eslint-disable-next-line no-console
          if (!called) fetchChild().catch(console.error);
        }}
        expanded={value.expanded}
      />

      {icon}
      {value.name}
    </Td>
  );
}
